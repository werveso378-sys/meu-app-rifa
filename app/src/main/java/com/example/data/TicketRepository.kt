package com.example.data

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class TicketRepository(private val firestore: FirebaseFirestore) {
    private val ticketsCollection = firestore.collection("tickets")
    private val settingsDoc = firestore.collection("settings").document("global")

    val allTickets: Flow<List<Ticket>> = callbackFlow {
        val listenerRegistration = ticketsCollection.addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            if (snapshot != null) {
                val tickets = snapshot.toObjects(Ticket::class.java).sortedBy { it.number }
                trySend(tickets).isSuccess
            }
        }
        awaitClose { listenerRegistration.remove() }
    }

    val settingsFlow: Flow<AppSettings> = callbackFlow {
        val listenerRegistration = settingsDoc.addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            if (snapshot != null && snapshot.exists()) {
                val settings = snapshot.toObject(AppSettings::class.java) ?: AppSettings()
                trySend(settings).isSuccess
            } else {
                trySend(AppSettings()).isSuccess
            }
        }
        awaitClose { listenerRegistration.remove() }
    }

    suspend fun updateSettings(price: Double, numbers: Int) {
        val updates = mapOf(
            "pixPrice" to price,
            "totalNumbers" to numbers
        )
        settingsDoc.set(updates, SetOptions.merge()).await()
    }

    suspend fun resetRaffle() {
        val snapshot = ticketsCollection.get().await()
        val batch = firestore.batch()
        snapshot.documents.forEach { doc ->
            batch.delete(doc.reference)
        }
        batch.commit().await()
    }

    suspend fun insertInitialTicketsIfNeeded(totalNumbers: Int = 100) {
        val snapshot = ticketsCollection.limit(1).get().await()
        if (snapshot.isEmpty) {
            val batch = firestore.batch()
            for (i in 1..totalNumbers) {
                val ticketRef = ticketsCollection.document(i.toString())
                batch.set(ticketRef, Ticket(number = i))
            }
            batch.commit().await()
        }
    }

    suspend fun insertTickets(tickets: List<Ticket>) {
    }

    suspend fun updateTicket(ticket: Ticket) {
        ticketsCollection.document(ticket.number.toString()).set(ticket).await()
    }

    suspend fun updateTickets(tickets: List<Ticket>) {
        val batch = firestore.batch()
        tickets.forEach { ticket ->
            val ref = ticketsCollection.document(ticket.number.toString())
            batch.set(ref, ticket)
        }
        batch.commit().await()
    }

    suspend fun togglePaymentStatus(ownerName: String, isPaid: Boolean) {
        val snapshot = ticketsCollection.whereEqualTo("ownerName", ownerName).get().await()
        val batch = firestore.batch()
        snapshot.documents.forEach { doc ->
            batch.update(doc.reference, "isPaid", isPaid)
        }
        batch.commit().await()
    }

    suspend fun updateOwnerName(oldName: String, newName: String) {
        val snapshot = ticketsCollection.whereEqualTo("ownerName", oldName).get().await()
        val batch = firestore.batch()
        snapshot.documents.forEach { doc ->
            batch.update(doc.reference, "ownerName", newName)
        }
        batch.commit().await()
    }

    suspend fun removeOwner(ownerName: String) {
        val snapshot = ticketsCollection.whereEqualTo("ownerName", ownerName).get().await()
        val batch = firestore.batch()
        snapshot.documents.forEach { doc ->
            batch.update(doc.reference, mapOf(
                "ownerName" to null,
                "paymentType" to null,
                "isPaid" to false
            ))
        }
        batch.commit().await()
    }
}
