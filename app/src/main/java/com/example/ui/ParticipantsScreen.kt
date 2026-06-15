package com.example.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.data.Ticket

@Composable
fun ParticipantsScreen(
    tickets: List<Ticket>,
    onTogglePayment: (String, Boolean) -> Unit,
    onEditName: (String, String) -> Unit,
    onDeletePerson: (String) -> Unit,
    onAddNumbers: (String, String) -> Unit,
    modifier: Modifier = Modifier
) {
    // Group tickets by ownerName
    val ownersMap = tickets
        .filter { it.ownerName != null }
        .groupBy { it.ownerName!! }
        .toList()
        .sortedBy { it.first }

    var expandedOwner by remember { mutableStateOf<String?>(null) }
    
    var editPersonName by remember { mutableStateOf<String?>(null) }
    var currentEditName by remember { mutableStateOf("") }
    
    var showDeleteConfirm by remember { mutableStateOf<String?>(null) }
    
    var addNumbersPerson by remember { mutableStateOf<Pair<String, String>?>(null) } // Name, paymentType
    var additionalNumbers by remember { mutableStateOf("") }

    Column(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Text(
            "Convidados confirmados",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.padding(top = 20.dp, start = 20.dp, bottom = 8.dp)
        )

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(ownersMap) { (ownerName, ownerTickets) ->
                val isExpanded = expandedOwner == ownerName
                val isPaid = ownerTickets.firstOrNull()?.isPaid == true
                val paymentType = ownerTickets.firstOrNull()?.paymentType ?: ""
                val numbersStr = ownerTickets.map { it.number }.sorted().joinToString(", ")

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .clickable { expandedOwner = if (isExpanded) null else ownerName },
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = ownerName,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Badge(
                                containerColor = if (isPaid) Color(0xFF4CAF50) else MaterialTheme.colorScheme.secondaryContainer,
                                contentColor = if (isPaid) Color.White else MaterialTheme.colorScheme.onSecondaryContainer
                            ) {
                                Text(
                                    text = if (isPaid) "Ok" else "Pendente",
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        
                        Text(
                            text = "${if(paymentType=="PIX") "Pix" else "Mimo"} - $numbersStr",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                            modifier = Modifier.padding(top = 6.dp)
                        )

                        AnimatedVisibility(visible = isExpanded) {
                            Column(modifier = Modifier.padding(top = 16.dp)) {
                                HorizontalDivider(color = MaterialTheme.colorScheme.onSurface.copy(alpha=0.1f))
                                Spacer(modifier = Modifier.height(16.dp))
                                
                                val statusText = if (paymentType == "PIX") {
                                    if (isPaid) "Pix recebido! \uD83D\uDCB8" else "Aguardando Pix"
                                } else {
                                    if (isPaid) "Mimo recebido! \uD83E\uDDF8" else "Aguardando mimo"
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = if (isPaid) Icons.Default.CheckCircle else Icons.Default.Info,
                                            contentDescription = null,
                                            tint = if (isPaid) Color(0xFF4CAF50) else MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = statusText, 
                                            style = MaterialTheme.typography.bodyMedium,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                    }
                                    
                                    Button(
                                        onClick = { onTogglePayment(ownerName, !isPaid) },
                                        shape = RoundedCornerShape(12.dp),
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = if (isPaid) MaterialTheme.colorScheme.surfaceVariant else MaterialTheme.colorScheme.primary,
                                            contentColor = if (isPaid) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onPrimary
                                        )
                                    ) {
                                        Text(if (isPaid) "Desmarcar" else "Confirmar")
                                    }
                                }
                                
                                Spacer(modifier = Modifier.height(16.dp))
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    OutlinedButton(
                                        onClick = { 
                                            currentEditName = ownerName
                                            editPersonName = ownerName 
                                        },
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Icon(Icons.Default.Edit, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.width(4.dp))
                                        Text("Nome", style = MaterialTheme.typography.labelMedium)
                                    }
                                    OutlinedButton(
                                        onClick = { addNumbersPerson = ownerName to paymentType },
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.width(4.dp))
                                        Text("+ Números", style = MaterialTheme.typography.labelMedium)
                                    }
                                    IconButton(
                                        onClick = { showDeleteConfirm = ownerName },
                                        colors = IconButtonDefaults.iconButtonColors(contentColor = MaterialTheme.colorScheme.error)
                                    ) {
                                        Icon(Icons.Default.Delete, contentDescription = "Excluir")
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            if (ownersMap.isEmpty()) {
                item {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(top = 40.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Nenhum convidado ainda.",
                            style = MaterialTheme.typography.bodyLarge,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                        )
                    }
                }
            }
        }
    }

    if (editPersonName != null) {
        AlertDialog(
            onDismissRequest = { editPersonName = null },
            title = { Text("Editar Nome") },
            text = {
                OutlinedTextField(
                    value = currentEditName,
                    onValueChange = { currentEditName = it },
                    label = { Text("Novo nome") },
                    singleLine = true
                )
            },
            confirmButton = {
                Button(onClick = { 
                    onEditName(editPersonName!!, currentEditName)
                    editPersonName = null 
                }) { Text("Salvar") }
            },
            dismissButton = {
                TextButton(onClick = { editPersonName = null }) { Text("Cancelar") }
            }
        )
    }

    if (showDeleteConfirm != null) {
        AlertDialog(
            onDismissRequest = { showDeleteConfirm = null },
            title = { Text("Excluir convidado?") },
            text = { Text("Ao excluir, todos os números reservados por ${showDeleteConfirm} ficarão disponíveis novamente.") },
            confirmButton = {
                Button(
                    onClick = { 
                        onDeletePerson(showDeleteConfirm!!)
                        showDeleteConfirm = null 
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) { Text("Excluir") }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteConfirm = null }) { Text("Cancelar") }
            }
        )
    }

    if (addNumbersPerson != null) {
        AlertDialog(
            onDismissRequest = { addNumbersPerson = null },
            title = { Text("Adicionar mais números") },
            text = {
                Column {
                    Text("Digite os números que deseja adicionar (separados por vírgula):")
                    Spacer(Modifier.height(8.dp))
                    OutlinedTextField(
                        value = additionalNumbers,
                        onValueChange = { additionalNumbers = it },
                        label = { Text("Ex: 15, 23, 40") },
                        singleLine = true
                    )
                }
            },
            confirmButton = {
                Button(onClick = { 
                    onAddNumbers(addNumbersPerson!!.first, additionalNumbers)
                    additionalNumbers = ""
                    addNumbersPerson = null 
                }) { Text("Adicionar") }
            },
            dismissButton = {
                TextButton(onClick = { 
                    additionalNumbers = ""
                    addNumbersPerson = null 
                }) { Text("Cancelar") }
            }
        )
    }
}
