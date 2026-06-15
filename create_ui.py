import os

content = '''package com.example.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.Ticket
import com.example.R

val BgColor = Color(0xFFF9F6ED)
val DarkGreen = Color(0xFF4C6A2B)
val LightGreen = Color(0xFF637442)

@Composable
fun NumbersScreen(
    tickets: List<Ticket>,
    onAssignSelected: (List<Int>, String, String) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedNumbers by remember { mutableStateOf(setOf<Int>()) }
    var showDialog by remember { mutableStateOf(false) }

    Box(modifier = modifier.fillMaxSize().background(BgColor)) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            HeaderSection()
            Spacer(modifier = Modifier.height(24.dp))
            PrizesSection()
            Spacer(modifier = Modifier.height(32.dp))
            NumbersGrid(tickets, selectedNumbers) { num ->
                if (selectedNumbers.contains(num)) {
                    selectedNumbers = selectedNumbers - num
                } else {
                    selectedNumbers = selectedNumbers + num
                }
            }
            Spacer(modifier = Modifier.height(32.dp))
            
            Box(modifier = Modifier.height(56.dp), contentAlignment = Alignment.Center) {
                if (selectedNumbers.isNotEmpty()) {
                    val infiniteTransition = rememberInfiniteTransition()
                    val pulseAnim by infiniteTransition.animateFloat(
                        initialValue = 1f, targetValue = 1.05f,
                        animationSpec = infiniteRepeatable(tween(1500, easing = FastOutSlowInEasing), RepeatMode.Reverse)
                    )
                    Button(
                        onClick = { showDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = DarkGreen),
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier
                            .fillMaxWidth(0.8f)
                            .height(50.dp)
                            .graphicsLayer { scaleX = pulseAnim; scaleY = pulseAnim }
                            .shadow(4.dp, RoundedCornerShape(20.dp))
                    ) {
                        Text(
                            text = "CONFIRMAR (\)",
                            color = Color(0xFFF3E5D8),
                            fontWeight = FontWeight.ExtraBold,
                            fontFamily = FontFamily.Serif,
                            fontSize = 18.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
            InstructionsSection()
            Spacer(modifier = Modifier.height(24.dp))
            TwoWaysSection()
            Spacer(modifier = Modifier.height(60.dp))
        }
    }

    if (showDialog) {
        AssignDialog(
            selectedNumbers = selectedNumbers.toList().sorted(),
            onDismiss = { showDialog = false },
            onConfirm = { name, type ->
                onAssignSelected(selectedNumbers.toList(), name, type)
                selectedNumbers = setOf()
                showDialog = false
            }
        )
    }
}

@Composable
fun HeaderSection() {
    val infiniteTransition = rememberInfiniteTransition()
    val floatAnim1 by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = 8f,
        animationSpec = infiniteRepeatable(tween(2500, easing = LinearEasing), RepeatMode.Reverse)
    )
    val floatAnim2 by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = -8f,
        animationSpec = infiniteRepeatable(tween(3000, easing = LinearEasing), RepeatMode.Reverse)
    )

    Box(
        modifier = Modifier.fillMaxWidth().height(160.dp),
        contentAlignment = Alignment.Center
    ) {
        // Decorative border box for title
        Box(
            modifier = Modifier
                .width(260.dp)
                .height(100.dp)
                .clip(RoundedCornerShape(32.dp))
                .border(4.dp, DarkGreen, RoundedCornerShape(32.dp))
                .background(Color.White),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("chá rifa", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color(0xFF5A3E26), fontFamily = FontFamily.Serif)
                Text("BABY", fontSize = 48.sp, fontWeight = FontWeight.ExtraBold, color = DarkGreen)
            }
        }
        
        Image(
            painter = painterResource(id = R.drawable.anim_bear_balloons),
            contentDescription = null,
            modifier = Modifier.size(100.dp).align(Alignment.CenterStart).offset(x = (-10).dp, y = floatAnim1.dp)
        )
        Image(
            painter = painterResource(id = R.drawable.anim_balloon),
            contentDescription = null,
            modifier = Modifier.size(70.dp).align(Alignment.TopEnd).offset(x = 10.dp, y = floatAnim2.dp)
        )
        Image(
            painter = painterResource(id = R.drawable.anim_crown),
            contentDescription = null,
            modifier = Modifier.size(40.dp).align(Alignment.TopCenter).offset(y = (-20).dp)
        )
    }
}

@Composable
fun PrizesSection() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        PrizeCard("1º", "R,00")
        PrizeCard("2º", "R,00")
    }
}

@Composable
fun PrizeCard(pos: String, value: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .width(140.dp)
            .border(2.dp, Color(0xFFD6DDBE), RoundedCornerShape(16.dp))
            .background(Color.White, RoundedCornerShape(16.dp))
            .padding(12.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier.size(36.dp).background(DarkGreen, RoundedCornerShape(18.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text(pos, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text("PRÊMIO", color = DarkGreen, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(value, color = DarkGreen, fontWeight = FontWeight.ExtraBold, fontSize = 24.sp)
        Spacer(modifier = Modifier.height(8.dp))
        Row(horizontalArrangement = Arrangement.Center, modifier = Modifier.fillMaxWidth()) {
            repeat(4) {
                Image(
                    painter = painterResource(id = R.drawable.rosto_urso),
                    contentDescription = null,
                    modifier = Modifier.size(20.dp).padding(horizontal = 2.dp)
                )
            }
        }
    }
}

@Composable
fun NumbersGrid(tickets: List<Ticket>, selectedNumbers: Set<Int>, onNumberClick: (Int) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .border(2.dp, Color(0xFFD6DDBE), RoundedCornerShape(12.dp))
            .background(Color.White, RoundedCornerShape(12.dp))
            .padding(8.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        for (row in 0 until 10) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                for (col in 0 until 10) {
                    val num = row * 10 + col + 1
                    val ticket = tickets.find { it.number == num }
                    val isSelected = selectedNumbers.contains(num)
                    val isAssigned = ticket?.ownerName != null
                    
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .aspectRatio(1f)
                            .padding(2.dp)
                            .clip(RoundedCornerShape(4.dp))
                            .clickable(enabled = !isAssigned) { onNumberClick(num) },
                        contentAlignment = Alignment.Center
                    ) {
                        if (!isSelected && !isAssigned) {
                            Text(
                                text = num.toString(),
                                color = LightGreen,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        } else {
                            val imageRes = if (ticket?.paymentType == "PIX") {
                                R.drawable.rosto_urso_gravata
                            } else {
                                R.drawable.rosto_urso
                            }
                            Image(
                                painter = painterResource(id = imageRes),
                                contentDescription = null,
                                modifier = Modifier.fillMaxSize(0.8f) // Keeps it well inside the square
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun InstructionsSection() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .border(2.dp, Color(0xFFD6DDBE), RoundedCornerShape(16.dp))
            .background(Color.White, RoundedCornerShape(16.dp))
            .padding(16.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier
                    .offset(y = (-28).dp)
                    .background(DarkGreen, RoundedCornerShape(12.dp))
                    .padding(horizontal = 16.dp, vertical = 6.dp)
            ) {
                Text("Como irá funcionar?", color = Color.White, fontWeight = FontWeight.Bold)
            }
            Text(
                "Cada número vale um pacote de fralda + mimo,\nentrega será feita no dia 25 de julho.",
                textAlign = TextAlign.Center, color = Color(0xFF5A3E26), fontSize = 14.sp, fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                "O sorteio do prêmio será no dia 29 de julho.",
                textAlign = TextAlign.Center, color = DarkGreen, fontSize = 14.sp, fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Box(
                modifier = Modifier.background(Color(0xFFE2E7D3), RoundedCornerShape(8.dp)).padding(8.dp)
            ) {
                Text("Via Pix: solicite a chave e mande o comprovante.", color = DarkGreen, fontSize = 12.sp)
            }
        }
        Image(
            painter = painterResource(id = R.drawable.anim_bear_sitting),
            contentDescription = null,
            modifier = Modifier.size(70.dp).align(Alignment.BottomEnd).offset(x = 10.dp, y = 10.dp)
        )
    }
}

@Composable
fun TwoWaysSection() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .border(2.dp, Color(0xFFD6DDBE), RoundedCornerShape(16.dp))
            .background(Color.White, RoundedCornerShape(16.dp))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .offset(y = (-28).dp)
                .background(DarkGreen, RoundedCornerShape(12.dp))
                .padding(horizontal = 16.dp, vertical = 6.dp)
        ) {
            Text("VOCÊ PODE PARTICIPAR DE 2 FORMAS:", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.weight(1f)) {
                Image(painter = painterResource(id = R.drawable.anim_diaper_1), contentDescription = null, modifier = Modifier.size(50.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text("1) DOAR", fontWeight = FontWeight.Bold, color = Color(0xFF5A3E26))
                Box(modifier = Modifier.background(DarkGreen, RoundedCornerShape(4.dp)).padding(horizontal = 4.dp, vertical = 2.dp)) {
                    Text("FRALDA + MIMO", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text("Cada número =\n1 pacote de fralda\n+ 1 mimo", textAlign = TextAlign.Center, fontSize = 10.sp, color = Color.Gray)
            }
            
            Box(modifier = Modifier.width(2.dp).height(80.dp).background(Color(0xFFE2E7D3)))
            
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.weight(1f)) {
                Image(painter = painterResource(id = R.drawable.anim_pix), contentDescription = null, modifier = Modifier.size(50.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text("2) PIX", fontWeight = FontWeight.Bold, color = Color(0xFF5A3E26))
                Text("R\,00", fontWeight = FontWeight.ExtraBold, color = DarkGreen)
                Spacer(modifier = Modifier.height(4.dp))
                Text("Cada número\nescolhido", textAlign = TextAlign.Center, fontSize = 10.sp, color = Color.Gray)
            }
        }
    }
}

// Keeping the original AssignDialog implementation
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AssignDialog(
    selectedNumbers: List<Int>,
    onDismiss: () -> Unit,
    onConfirm: (String, String) -> Unit
) {
    var step by remember { mutableStateOf(1) }
    var name by remember { mutableStateOf("") }
    var selectedType by remember { mutableStateOf<String?>(null) }
    var isPixScheduled by remember { mutableStateOf(false) }
    var pixCodeGenerated by remember { mutableStateOf<String?>(null) }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(24.dp),
        title = { 
            Text(
                text = when(step) {
                    1 -> "Seus Dados"
                    2 -> "Revisão dos Números"
                    3 -> "Forma de Colaboração"
                    4 -> if (selectedType == "PIX") "Pagamento PIX" else "Sucesso!"
                    else -> ""
                },
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            ) 
        },
        text = {
            Column(
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                when (step) {
                    1 -> {
                        OutlinedTextField(
                            value = name,
                            onValueChange = { name = it },
                            label = { Text("Nome Completo") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        )
                    }
                    2 -> {
                        Text("Olá, \!", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text("Você escolheu os números:")
                        Text(selectedNumbers.joinToString(", "), style = MaterialTheme.typography.headlineSmall, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Black)
                        Text("Confirma que são esses mesmos?", style = MaterialTheme.typography.bodyMedium)
                    }
                    3 -> {
                        Text("Escolha como prefere contribuir:", style = MaterialTheme.typography.bodyMedium)
                        OutlinedCard(onClick = { selectedType = "MIMO"; step = 4 }, modifier = Modifier.fillMaxWidth(), colors = CardDefaults.outlinedCardColors(containerColor = if (selectedType == "MIMO") MaterialTheme.colorScheme.primaryContainer else Color.Transparent)) {
                            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) { Text("??", fontSize = 24.sp); Spacer(modifier = Modifier.width(16.dp)); Text("DOAR FRALDA + MIMO", fontWeight = FontWeight.Bold) }
                        }
                        OutlinedCard(onClick = { selectedType = "PIX"; step = 4 }, modifier = Modifier.fillMaxWidth(), colors = CardDefaults.outlinedCardColors(containerColor = if (selectedType == "PIX") MaterialTheme.colorScheme.primaryContainer else Color.Transparent)) {
                            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) { Text("??", fontSize = 24.sp); Spacer(modifier = Modifier.width(16.dp)); Text("PIX (R\,00)", fontWeight = FontWeight.Bold) }
                        }
                    }
                    4 -> {
                        if (selectedType == "PIX") {
                            if (pixCodeGenerated != null) {
                                Text("Chave PIX Gerada (Copia e Cola):", fontWeight = FontWeight.Bold)
                                OutlinedTextField(value = pixCodeGenerated!!, onValueChange = {}, readOnly = true, modifier = Modifier.fillMaxWidth())
                                Button(onClick = { onConfirm(name, "PIX") }, modifier = Modifier.fillMaxWidth()) { Text("Copiar Chave e Salvar") }
                            } else {
                                Text("Prefere pagar agora ou agendar para o dia 25 de Julho?")
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    OutlinedButton(onClick = { isPixScheduled = true; onConfirm(name, "PIX") }, modifier = Modifier.weight(1f)) { Text("Dia 25", textAlign = TextAlign.Center) }
                                    Button(onClick = { pixCodeGenerated = "00020126580014br.gov.bcb.pix0136sua-chave-aleatoria-gerada" }, modifier = Modifier.weight(1f)) { Text("Agora", textAlign = TextAlign.Center) }
                                }
                            }
                        } else {
                            Text("Tudo certo! Seus números foram reservados para o Mimo.")
                            Button(onClick = { onConfirm(name, "MIMO") }, modifier = Modifier.fillMaxWidth()) { Text("Finalizar") }
                        }
                    }
                }
            }
        },
        confirmButton = {
            if (step < 3) { Button(onClick = { step++ }, enabled = name.isNotBlank()) { Text("Avançar") } }
        },
        dismissButton = {
            TextButton(onClick = { if (step > 1) step-- else onDismiss() }) { Text(if (step > 1) "Voltar" else "Cancelar") }
        }
    )
}
'''

with open('app/src/main/java/com/example/ui/NumbersScreen.kt', 'w', encoding='utf-8') as f:
    f.write(content)

print("UI Replaced successfully")
