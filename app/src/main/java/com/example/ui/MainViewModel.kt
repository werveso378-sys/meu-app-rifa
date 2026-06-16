package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.data.Ticket
import com.example.data.TicketRepository
import com.example.data.AppSettings
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class MainViewModel(private val repository: TicketRepository) : ViewModel() {

    val tickets: StateFlow<List<Ticket>> = repository.allTickets
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val appSettings: StateFlow<AppSettings> = repository.settingsFlow
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = AppSettings()
        )

    init {
        initializeTickets()
    }

    private fun initializeTickets() {
        viewModelScope.launch {
            // Espera as configuraes chegarem primeiro (se houver)
            val settings = repository.settingsFlow.first()
            val totalNumbers = settings.totalNumbers
            
            val currentList = repository.allTickets.first()
            if (currentList.isEmpty()) {
                repository.insertInitialTicketsIfNeeded(totalNumbers)
            }
        }
    }

    // Assign a list of tickets to someone
    fun assignTickets(selectedNumbers: List<Int>, ownerName: String, phone: String, paymentType: String) {
        viewModelScope.launch {
            val list = tickets.value
            val updatedTickets = list.filter { it.number in selectedNumbers }.map { 
                it.copy(
                    ownerName = ownerName.trim(),
                    phone = phone.trim(),
                    paymentType = paymentType,
                    isPaid = false
                )
            }
            repository.updateTickets(updatedTickets)
        }
    }

    fun togglePaymentStatusForOwner(ownerName: String, isPaid: Boolean) {
        viewModelScope.launch {
            repository.togglePaymentStatus(ownerName, isPaid)
        }
    }

    fun updateParticipantName(oldName: String, newName: String) {
        if (newName.isBlank()) return
        viewModelScope.launch {
            repository.updateOwnerName(oldName, newName.trim())
        }
    }

    fun removeParticipant(ownerName: String) {
        viewModelScope.launch {
            repository.removeOwner(ownerName)
        }
    }

    fun addNumbersToParticipant(numbers: List<Int>, ownerName: String, phone: String, paymentType: String) {
        assignTickets(numbers, ownerName, phone, paymentType)
    }

    fun updateSettings(price: Double, numbers: Int) {
        viewModelScope.launch {
            repository.updateSettings(price, numbers)
            repository.insertInitialTicketsIfNeeded(numbers) // Adiciona novos tickets se o limite aumentou
        }
    }

    fun resetRaffle() {
        viewModelScope.launch {
            repository.resetRaffle()
            val settings = repository.settingsFlow.first()
            repository.insertInitialTicketsIfNeeded(settings.totalNumbers)
        }
    }
}

class MainViewModelFactory(private val repository: TicketRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(MainViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return MainViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
