package com.example.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.AppSettings

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminScreen(
    settings: AppSettings,
    onSaveSettings: (Double, Int) -> Unit,
    onResetRaffle: () -> Unit
) {
    var priceText by remember(settings.pixPrice) { mutableStateOf(settings.pixPrice.toString()) }
    var numbersText by remember(settings.totalNumbers) { mutableStateOf(settings.totalNumbers.toString()) }
    var showResetDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF7F5EC))
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Configurações da Rifa",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF5A3E26),
            modifier = Modifier.padding(bottom = 24.dp, top = 32.dp)
        )

        OutlinedCard(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.outlinedCardColors(containerColor = Color.White),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Preço do PIX (R$)", fontWeight = FontWeight.Bold, color = Color(0xFF4C6A2B))
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = priceText,
                    onValueChange = { priceText = it },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(16.dp))

                Text("Total de Números", fontWeight = FontWeight.Bold, color = Color(0xFF4C6A2B))
                Text("Dica: Use múltiplos de 10 (ex: 100, 150)", fontSize = 12.sp, color = Color.Gray)
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = numbersText,
                    onValueChange = { numbersText = it },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        val p = priceText.toDoubleOrNull() ?: 40.0
                        val n = numbersText.toIntOrNull() ?: 100
                        onSaveSettings(p, n)
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4C6A2B))
                ) {
                    Text("Salvar Configurações", color = Color.White)
                }
            }
        }

        Spacer(modifier = Modifier.height(48.dp))

        // Zona de Perigo
        OutlinedCard(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.outlinedCardColors(containerColor = Color(0xFFFFF0F0)),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color.Red),
            shape = RoundedCornerShape(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(Icons.Default.Warning, contentDescription = "Aviso", tint = Color.Red, modifier = Modifier.size(40.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text("Zona de Perigo", fontWeight = FontWeight.Bold, color = Color.Red, fontSize = 18.sp)
                Text(
                    "Esta ação apaga todos os participantes e tickets atuais do banco de dados.",
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    color = Color.DarkGray,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(vertical = 8.dp)
                )

                Button(
                    onClick = { showResetDialog = true },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Red)
                ) {
                    Text("Zerar Rifa", color = Color.White)
                }
            }
        }
    }

    if (showResetDialog) {
        AlertDialog(
            onDismissRequest = { showResetDialog = false },
            title = { Text("Apagar todos os dados?") },
            text = { Text("Tem certeza que deseja zerar a rifa? Todos os tickets escolhidos e os nomes serão deletados permanentemente. Esta ação não pode ser desfeita.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        showResetDialog = false
                        onResetRaffle()
                    }
                ) {
                    Text("Sim, Zerar Rifa", color = Color.Red)
                }
            },
            dismissButton = {
                TextButton(onClick = { showResetDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }
}
