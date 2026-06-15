package com.example.data

import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class TicketRepository(private val firestore: FirebaseFirestore) {
    private val ticketsCollection = firestore.collection("tickets")

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

    suspend fun insertInitialTicketsIfNeeded() {
        // Inicialização de 100 números se a coleção estiver vazia
        val snapshot = ticketsCollection.limit(1).get().await()
        if (snapshot.isEmpty) {
            val batch = firestore.batch()
            for (i in 1..100) {
                val ticketRef = ticketsCollection.document(i.toString())
                batch.set(ticketRef, Ticket(number = i))
            }
            batch.commit().await()
        }
    }

    suspend fun insertTickets(tickets: List<Ticket>) {
        // Não precisamos de insertTickets massivo depois do initial
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
