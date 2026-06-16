package com.example.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.data.Ticket

enum class AppRoute {
    Dashboard,
    Numbers,
    Participants,
    Admin
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppScreen(viewModel: MainViewModel) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: AppRoute.Dashboard.name
    
    val tickets by viewModel.tickets.collectAsState()
    val settings by viewModel.appSettings.collectAsState()

    Scaffold(
        // topBar removed to allow full screen image
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home", fontWeight = FontWeight.Medium) },
                    selected = currentRoute == AppRoute.Dashboard.name,
                    onClick = {
                        navController.navigate(AppRoute.Dashboard.name) {
                            popUpTo(AppRoute.Dashboard.name) { inclusive = true }
                        }
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.List, contentDescription = "Números") },
                    label = { Text("Rifa", fontWeight = FontWeight.Medium) },
                    selected = currentRoute == AppRoute.Numbers.name,
                    onClick = {
                        navController.navigate(AppRoute.Numbers.name) {
                            popUpTo(AppRoute.Dashboard.name)
                        }
                    }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, contentDescription = "Convidados") },
                    label = { Text("Convidados", fontWeight = FontWeight.Medium) },
                    selected = currentRoute == AppRoute.Participants.name,
                    onClick = {
                        navController.navigate(AppRoute.Participants.name) {
                            popUpTo(AppRoute.Dashboard.name)
                        }
                    }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = AppRoute.Dashboard.name,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(AppRoute.Dashboard.name) {
                DashboardScreen(
                    tickets = tickets,
                    onAdminClick = { navController.navigate(AppRoute.Admin.name) }
                )
            }
            composable(AppRoute.Numbers.name) {
                NumbersScreen()
            }
            composable(AppRoute.Participants.name) {
                ParticipantsScreen(
                    tickets = tickets,
                    onTogglePayment = { ownerName, isPaid ->
                        viewModel.togglePaymentStatusForOwner(ownerName, isPaid)
                    },
                    onEditName = { oldName, newName ->
                        viewModel.updateParticipantName(oldName, newName)
                    },
                    onDeletePerson = { ownerName ->
                        viewModel.removeParticipant(ownerName)
                    },
                    onAddNumbers = { ownerName, numString ->
                        // Parse numbers and assign to existing person string
                        val numbersToAdd = numString.split(",")
                            .mapNotNull { it.trim().toIntOrNull() }
                        if (numbersToAdd.isNotEmpty()) {
                            // find payment type and phone
                            val existingTicket = tickets.find { it.ownerName == ownerName }
                            val type = existingTicket?.paymentType ?: "PIX"
                            val phone = existingTicket?.phone ?: ""
                            viewModel.addNumbersToParticipant(numbersToAdd, ownerName, phone, type)
                        }
                    }
                )
            }
            composable(AppRoute.Admin.name) {
                AdminScreen(
                    settings = settings,
                    onSaveSettings = { price, total, sounds, popupActive, popupMessage ->
                        viewModel.updateSettings(price, total, sounds, popupActive, popupMessage)
                    },
                    onResetRaffle = {
                        viewModel.resetRaffle()
                    }
                )
            }
        }
    }
}
