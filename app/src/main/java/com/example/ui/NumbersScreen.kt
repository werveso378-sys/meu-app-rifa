package com.example.ui

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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.TransformOrigin
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import com.example.data.Ticket
import com.example.R
import com.example.network.RetrofitClient
import com.example.network.PixRequest
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import androidx.compose.ui.graphics.asImageBitmap

val BgColor = Color(0xFFE9E5D3)
val DarkGreen = Color(0xFF4C6A2B)
val LightGreen = Color(0xFF637442)

@Composable
fun NumbersScreen(
    tickets: List<Ticket>,
    onAssignSelected: (List<Int>, String, String, String) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedNumbers by remember { mutableStateOf(setOf<Int>()) }
    var showDialog by remember { mutableStateOf(false) }

    val gradientBg = Brush.verticalGradient(
        colors = listOf(Color(0xFFFBF9F1), Color(0xFFE9E5D3), Color(0xFFD6DDBE))
    )

    Box(modifier = modifier.fillMaxSize().background(gradientBg)) {
        // Dynamic Stars Background
        BackgroundStars()
        
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            NumbersHeaderSection()
            Spacer(modifier = Modifier.height(8.dp))
            NumbersPrizesSection()
            Spacer(modifier = Modifier.height(8.dp))
            NumbersGridContent(tickets, selectedNumbers) { num ->
                if (selectedNumbers.contains(num)) {
                    selectedNumbers = selectedNumbers - num
                } else {
                    selectedNumbers = selectedNumbers + num
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Confirm Button Area
            Box(modifier = Modifier.height(70.dp).fillMaxWidth(), contentAlignment = Alignment.Center) {
                if (selectedNumbers.isNotEmpty()) {
                    val infiniteTransition = rememberInfiniteTransition()
                    
                    // Button Pulse
                    val pulseAnim by infiniteTransition.animateFloat(
                        initialValue = 1f, targetValue = 1.03f,
                        animationSpec = infiniteRepeatable(tween(1200, easing = FastOutSlowInEasing), RepeatMode.Reverse)
                    )
                    
                    // Shimmer Reflection
                    val shimmerAnim by infiniteTransition.animateFloat(
                        initialValue = -500f, targetValue = 1000f,
                        animationSpec = infiniteRepeatable(tween(2500, delayMillis = 1000, easing = LinearEasing), RepeatMode.Restart)
                    )
                    
                    val gradientBrush = Brush.linearGradient(
                        colors = listOf(Color(0xFF4C6A2B), Color(0xFF7CA64A), Color(0xFF4C6A2B)),
                        start = Offset(0f, 0f),
                        end = Offset(0f, Float.POSITIVE_INFINITY)
                    )

                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.85f)
                            .height(60.dp)
                            .graphicsLayer { scaleX = pulseAnim; scaleY = pulseAnim }
                            .shadow(8.dp, RoundedCornerShape(30.dp))
                            .clip(RoundedCornerShape(30.dp))
                            .background(gradientBrush)
                            .clickable { showDialog = true },
                        contentAlignment = Alignment.Center
                    ) {
                        // The text
                        Text(
                            text = "CONFIRMAR (${selectedNumbers.size})",
                            color = Color(0xFFF3E5D8),
                            fontWeight = FontWeight.ExtraBold,
                            fontFamily = FontFamily.Serif,
                            fontSize = 20.sp,
                            modifier = Modifier.zIndex(2f)
                        )
                        // The shine effect
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .offset(x = shimmerAnim.dp)
                                .background(
                                    Brush.linearGradient(
                                        colors = listOf(Color.Transparent, Color.White.copy(alpha = 0.5f), Color.Transparent),
                                        start = Offset(0f, 0f),
                                        end = Offset(200f, 0f)
                                    )
                                )
                                .zIndex(3f)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            NumbersInstructionsSection()
            Spacer(modifier = Modifier.height(16.dp))
            NumbersTwoWaysSection()
            Spacer(modifier = Modifier.height(16.dp))
        }
    }

    if (showDialog) {
        AssignDialog(
            selectedNumbers = selectedNumbers.toList().sorted(),
            onDismiss = { showDialog = false },
            onConfirm = { name, phone, type ->
                onAssignSelected(selectedNumbers.toList(), name, phone, type)
                selectedNumbers = setOf()
                showDialog = false
            }
        )
    }
}

@Composable
private fun BackgroundStars() {
    val infiniteTransition = rememberInfiniteTransition()
    val float1 by infiniteTransition.animateFloat(initialValue = 0f, targetValue = 15f, animationSpec = infiniteRepeatable(tween(4000, easing = LinearEasing), RepeatMode.Reverse))
    val float2 by infiniteTransition.animateFloat(initialValue = 0f, targetValue = -15f, animationSpec = infiniteRepeatable(tween(3500, easing = LinearEasing), RepeatMode.Reverse))
    
    Box(modifier = Modifier.fillMaxSize()) {
        Image(painter = painterResource(id = R.drawable.anim_star_1), contentDescription = null, modifier = Modifier.size(20.dp).align(Alignment.TopStart).offset(x = 110.dp, y = (60 + float1).dp))
        Image(painter = painterResource(id = R.drawable.anim_star_2), contentDescription = null, modifier = Modifier.size(24.dp).align(Alignment.TopEnd).offset(x = (-40).dp, y = (120 + float2).dp))
        Image(painter = painterResource(id = R.drawable.anim_star_3), contentDescription = null, modifier = Modifier.size(16.dp).align(Alignment.CenterStart).offset(x = 20.dp, y = float2.dp))
        Image(painter = painterResource(id = R.drawable.anim_star_4), contentDescription = null, modifier = Modifier.size(28.dp).align(Alignment.CenterEnd).offset(x = (-20).dp, y = (float1 - 40).dp))
        Image(painter = painterResource(id = R.drawable.anim_star_5), contentDescription = null, modifier = Modifier.size(20.dp).align(Alignment.BottomStart).offset(x = 50.dp, y = (-80 + float1).dp))
    }
}

@Composable
private fun NumbersHeaderSection() {
    val infiniteTransition = rememberInfiniteTransition()
    val floatAnim1 by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = 8f,
        animationSpec = infiniteRepeatable(tween(2500, easing = LinearEasing), RepeatMode.Reverse)
    )
    val floatAnim2 by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = -8f,
        animationSpec = infiniteRepeatable(tween(3000, easing = LinearEasing), RepeatMode.Reverse)
    )
    
    // Crown Tremble (Coroa)
    val trembleAnim by infiniteTransition.animateFloat(
        initialValue = -3f, targetValue = 3f,
        animationSpec = infiniteRepeatable(tween(80, easing = LinearEasing), RepeatMode.Reverse)
    )
    
    // Bottle Swing (Mamadeira)
    val swingAnim by infiniteTransition.animateFloat(
        initialValue = -15f, targetValue = 15f,
        animationSpec = infiniteRepeatable(tween(1500, easing = LinearEasing), RepeatMode.Reverse)
    )

    // Star Box Pulse (Caixa Estrela Brilhando/Piscando)
    val starBoxPulse by infiniteTransition.animateFloat(
        initialValue = 1f, targetValue = 1.15f,
        animationSpec = infiniteRepeatable(tween(1000, easing = FastOutSlowInEasing), RepeatMode.Reverse)
    )
    
    // Tie Animation (Gravata) - slight scale/bob
    val tieScale by infiniteTransition.animateFloat(
        initialValue = 0.95f, targetValue = 1.05f,
        animationSpec = infiniteRepeatable(tween(800, easing = FastOutSlowInEasing), RepeatMode.Reverse)
    )

    Box(
        modifier = Modifier.fillMaxWidth().height(160.dp),
        contentAlignment = Alignment.Center
    ) {
        // Decorative border box for title
        Box(
            modifier = Modifier
                .width(260.dp)
                .height(110.dp)
                .clip(RoundedCornerShape(32.dp))
                .border(4.dp, DarkGreen, RoundedCornerShape(32.dp))
                .background(Color.White),
            contentAlignment = Alignment.Center
        ) {
            Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.offset(y = (-4).dp)) {
                    Text("chá rifa", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color(0xFF5A3E26), fontFamily = FontFamily.Serif)
                    Text("BABY", fontSize = 48.sp, fontWeight = FontWeight.ExtraBold, color = DarkGreen)
                }
                
                // Tie properly placed BETWEEN and BELOW 'B' and 'A'
                Image(
                    painter = painterResource(id = R.drawable.anim_tie),
                    contentDescription = null,
                    modifier = Modifier
                        .size(30.dp)
                        .align(Alignment.BottomCenter)
                        .offset(x = (-2).dp, y = (-2).dp)
                        .graphicsLayer { scaleX = tieScale; scaleY = tieScale }
                )
            }
        }
        
        // Crown smaller and closer
        Image(
            painter = painterResource(id = R.drawable.anim_crown),
            contentDescription = null,
            modifier = Modifier
                .size(30.dp) // Reduced size
                .align(Alignment.TopCenter)
                .offset(y = (-5).dp) // Moved further down to touch the box
                .graphicsLayer { rotationZ = trembleAnim } // Tremble animation
        )
        
        // Bear balloons
        Image(
            painter = painterResource(id = R.drawable.anim_bear_balloons),
            contentDescription = null,
            modifier = Modifier.size(100.dp).align(Alignment.CenterStart).offset(x = (-10).dp, y = floatAnim1.dp)
        )
        
        // Balloon
        Image(
            painter = painterResource(id = R.drawable.anim_balloon),
            contentDescription = null,
            modifier = Modifier.size(70.dp).align(Alignment.TopEnd).offset(x = 10.dp, y = floatAnim2.dp)
        )
        
        // Bottle behind Star Box
        Box(modifier = Modifier.align(Alignment.CenterEnd).offset(x = 5.dp, y = 25.dp)) {
            // Bottle rendered first (Behind) with Swing Animation
            Image(
                painter = painterResource(id = R.drawable.anim_bottle),
                contentDescription = null,
                modifier = Modifier
                    .size(45.dp)
                    .offset(x = (-20).dp, y = (-15).dp) // Moved more to the left and up so it peeks out!
                    .graphicsLayer {
                        transformOrigin = TransformOrigin(0.5f, 1f) // Anchor at bottom
                        rotationZ = swingAnim
                    }
            )
            // Star Box rendered after (In Front) with Glowing/Pulse Animation
            Image(
                painter = painterResource(id = R.drawable.anim_star_box),
                contentDescription = null,
                modifier = Modifier
                    .size(50.dp)
                    .graphicsLayer { scaleX = starBoxPulse; scaleY = starBoxPulse }
            )
        }
    }
}

@Composable
private fun NumbersPrizesSection() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        NumbersPrizeCard("1º", "R$150,00")
        NumbersPrizeCard("2º", "R$100,00")
    }
}

@Composable
private fun NumbersPrizeCard(pos: String, value: String) {
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
            Text("🎁", fontSize = 24.sp, modifier = Modifier.padding(horizontal = 4.dp))
            Text("🎉", fontSize = 24.sp, modifier = Modifier.padding(horizontal = 4.dp))
        }
    }
}

@Composable
private fun NumbersGridContent(tickets: List<Ticket>, selectedNumbers: Set<Int>, onNumberClick: (Int) -> Unit) {
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
private fun NumbersInstructionsSection() {
    val infiniteTransition = rememberInfiniteTransition()
    
    // Backpack Animation (Mochila) - slight jump
    val bagAnim by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = -10f,
        animationSpec = infiniteRepeatable(tween(600, easing = FastOutSlowInEasing), RepeatMode.Reverse)
    )
    
    // Sitting Bear Animation (Ursinho) - breathe (scale slightly)
    val bearBreathe by infiniteTransition.animateFloat(
        initialValue = 1f, targetValue = 1.05f,
        animationSpec = infiniteRepeatable(tween(1200, easing = LinearEasing), RepeatMode.Reverse)
    )

    Box(modifier = Modifier.fillMaxWidth()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 14.dp)
                .border(2.dp, Color(0xFFD6DDBE), RoundedCornerShape(16.dp))
                .background(Color.White, RoundedCornerShape(16.dp))
                .padding(top = 28.dp, bottom = 80.dp, start = 16.dp, end = 16.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    "Cada número vale um pacote de fralda + mimo,\nentrega será feita no dia 25 de julho.",
                    textAlign = TextAlign.Center, color = Color(0xFF5A3E26), fontSize = 14.sp, fontWeight = FontWeight.Medium
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    "O sorteio do prêmio será no dia 29 de julho.",
                    textAlign = TextAlign.Center, color = DarkGreen, fontSize = 14.sp, fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(12.dp))
                Box(
                    modifier = Modifier.background(Color(0xFFE2E7D3), RoundedCornerShape(8.dp)).padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text("Via Pix: solicite a chave e mande o comprovante.", color = DarkGreen, fontSize = 11.sp)
                }
            }
            
            // Bag (Mochila)
            Image(
                painter = painterResource(id = R.drawable.anim_bag),
                contentDescription = null,
                modifier = Modifier
                    .size(60.dp)
                    .align(Alignment.BottomStart)
                    .offset(x = (-25).dp, y = (10 + bagAnim).dp)
            )
            
            // Sitting Bear
            Image(
                painter = painterResource(id = R.drawable.anim_bear_sitting),
                contentDescription = null,
                modifier = Modifier
                    .size(70.dp)
                    .align(Alignment.BottomEnd)
                    .offset(x = 10.dp, y = 20.dp)
                    .graphicsLayer { scaleX = bearBreathe; scaleY = bearBreathe }
            )
        }
        
        // Label for Instructions (floating overlapping the border)
        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .background(DarkGreen, RoundedCornerShape(12.dp))
                .padding(horizontal = 16.dp, vertical = 6.dp)
        ) {
            Text("Como irá funcionar?", color = Color.White, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun NumbersTwoWaysSection() {
    val infiniteTransition = rememberInfiniteTransition()
    
    // Diaper Animation (Fralda) - rotation
    val diaperAnim by infiniteTransition.animateFloat(
        initialValue = -5f, targetValue = 5f,
        animationSpec = infiniteRepeatable(tween(1000, easing = LinearEasing), RepeatMode.Reverse)
    )
    
    // Pix Animation - Shining/Bouncing
    val pixAnim by infiniteTransition.animateFloat(
        initialValue = 0f, targetValue = -15f,
        animationSpec = infiniteRepeatable(tween(500, easing = FastOutSlowInEasing), RepeatMode.Reverse)
    )

    Box(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 14.dp)
                .border(2.dp, Color(0xFFD6DDBE), RoundedCornerShape(16.dp))
                .background(Color.White, RoundedCornerShape(16.dp))
                .padding(top = 28.dp, bottom = 16.dp, start = 16.dp, end = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.weight(1f)) {
                    Image(
                        painter = painterResource(id = R.drawable.anim_diaper_1), 
                        contentDescription = null, 
                        modifier = Modifier
                            .size(50.dp)
                            .graphicsLayer { rotationZ = diaperAnim }
                    )
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
                    Image(
                        painter = painterResource(id = R.drawable.anim_pix), 
                        contentDescription = null, 
                        modifier = Modifier
                            .size(50.dp)
                            .offset(y = pixAnim.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("2) PIX", fontWeight = FontWeight.Bold, color = Color(0xFF5A3E26))
                    Text("R$40,00", fontWeight = FontWeight.ExtraBold, color = DarkGreen)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Cada número\nescolhido", textAlign = TextAlign.Center, fontSize = 10.sp, color = Color.Gray)
                }
            }
        }
        
        // Overlapping label
        Box(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .background(DarkGreen, RoundedCornerShape(12.dp))
                .padding(horizontal = 16.dp, vertical = 6.dp)
        ) {
            Text("VOCÊ PODE PARTICIPAR DE 2 FORMAS:", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AssignDialog(
    selectedNumbers: List<Int>,
    onDismiss: () -> Unit,
    onConfirm: (String, String, String) -> Unit
) {
    var step by remember { mutableStateOf(1) }
    var name by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var selectedType by remember { mutableStateOf<String?>(null) }
    var pixCodeGenerated by remember { mutableStateOf<String?>(null) }
    var qrCodeBase64 by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()
    
    val infiniteTransition = rememberInfiniteTransition()
    val pulseAnim by infiniteTransition.animateFloat(
        initialValue = 1f, targetValue = 1.02f,
        animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse)
    )

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(32.dp),
        title = {
            Text(
                text = when(step) {
                    1 -> "Seus Dados"
                    2 -> "Revisão dos Números"
                    3 -> "Forma de Colaboração"
                    4 -> if (selectedType == "PIX") "Pagamento PIX" else "Sucesso!"
                    else -> ""
                },
                fontWeight = FontWeight.ExtraBold,
                textAlign = TextAlign.Center,
                fontSize = 22.sp,
                color = DarkGreen,
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
                            shape = RoundedCornerShape(16.dp)
                        )
                        OutlinedTextField(
                            value = phone,
                            onValueChange = { newValue ->
                                val digits = newValue.filter { it.isDigit() }.take(11)
                                phone = buildString {
                                    digits.forEachIndexed { index, char ->
                                        if (index == 0) append("(")
                                        append(char)
                                        if (index == 1) append(") ")
                                        if (index == 6) append("-")
                                    }
                                }
                            },
                            label = { Text("WhatsApp (com DDD)") },
                            singleLine = true,
                            keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(keyboardType = androidx.compose.ui.text.input.KeyboardType.Number),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp)
                        )
                    }
                    2 -> {
                        Text("Olá, $name!", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text("Você escolheu os números:")
                        Box(modifier = Modifier.fillMaxWidth().background(Color(0xFFFBF9F1), RoundedCornerShape(12.dp)).padding(16.dp), contentAlignment = Alignment.Center) {
                            Text(selectedNumbers.joinToString(", "), style = MaterialTheme.typography.headlineSmall, color = DarkGreen, fontWeight = FontWeight.Black)
                        }
                    }
                    3 -> {
                        Text("Como você prefere contribuir?", fontWeight = FontWeight.Medium)
                        OutlinedCard(onClick = { selectedType = "MIMO"; step = 4 }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp), colors = CardDefaults.outlinedCardColors(containerColor = if (selectedType == "MIMO") Color(0xFFE9E5D3) else Color.Transparent)) {
                            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) { Text("🎁", fontSize = 28.sp); Spacer(modifier = Modifier.width(16.dp)); Text("DOAR FRALDA + MIMO", fontWeight = FontWeight.Bold, color = DarkGreen) }
                        }
                        OutlinedCard(onClick = { selectedType = "PIX"; step = 4 }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp), colors = CardDefaults.outlinedCardColors(containerColor = if (selectedType == "PIX") Color(0xFFE9E5D3) else Color.Transparent)) {
                            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) { Text("💸", fontSize = 28.sp); Spacer(modifier = Modifier.width(16.dp)); Text("PIX (R$40,00)", fontWeight = FontWeight.Bold, color = DarkGreen) }
                        }
                    }
                    4 -> {
                        if (selectedType == "PIX") {
                            if (pixCodeGenerated != null) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                                    Text("Escaneie o QR Code", fontWeight = FontWeight.Bold, color = DarkGreen)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Box(modifier = Modifier.size(150.dp).background(Color.Black, RoundedCornerShape(12.dp)).padding(4.dp)) {
                                        Box(modifier = Modifier.fillMaxSize().background(Color.White, RoundedCornerShape(8.dp)), contentAlignment = Alignment.Center) {
                                            Text("QR CODE AQUI", fontWeight = FontWeight.Bold)
                                        }
                                    }
                                      Spacer(modifier = Modifier.height(16.dp))
                                      if (qrCodeBase64 != null) {
                                          val bytes = android.util.Base64.decode(qrCodeBase64!!.substringAfter(","), android.util.Base64.DEFAULT)
                                          val bitmap = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                                          if (bitmap != null) {
                                              Image(
                                                  bitmap = androidx.compose.ui.graphics.asImageBitmap(bitmap),
                                                  contentDescription = "QR Code PIX",
                                                  modifier = Modifier.size(200.dp).align(Alignment.CenterHorizontally)
                                              )
                                              Spacer(modifier = Modifier.height(8.dp))
                                          }
                                      }
                                      Text("Ou copie o código PIX Copia e Cola:", fontSize = 12.sp)
                                    OutlinedTextField(value = pixCodeGenerated!!, onValueChange = {}, readOnly = true, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp))
                                    Spacer(modifier = Modifier.height(16.dp))
                                    Button(onClick = { onConfirm(name, phone, "PIX") }, modifier = Modifier.fillMaxWidth().height(50.dp).graphicsLayer { scaleX = pulseAnim; scaleY = pulseAnim }, colors = ButtonDefaults.buttonColors(containerColor = DarkGreen), shape = RoundedCornerShape(25.dp)) { Text("JÁ PAGUEI / CONCLUIR", fontWeight = FontWeight.Bold) }
                                }
                            } else {
                                Text("Prefere pagar agora ou agendar para o dia 25 de Julho?", textAlign = TextAlign.Center)
                                Spacer(modifier = Modifier.height(16.dp))
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    OutlinedButton(onClick = { onConfirm(name, phone, "PIX") }, modifier = Modifier.weight(1f).height(50.dp), shape = RoundedCornerShape(25.dp)) { Text("Dia 25", fontWeight = FontWeight.Bold, color = DarkGreen) }
                                    Button(onClick = { 
                                          isLoading = true
                                          coroutineScope.launch {
                                              try {
                                                  val response = withContext(Dispatchers.IO) {
                                                      RetrofitClient.instance.createPix(PixRequest("1", name, "example@email.com", selectedNumbers))
                                                  }
                                                  if (response.success && response.qr_code != null) {
                                                      pixCodeGenerated = response.qr_code
                                                      qrCodeBase64 = response.qr_code_base64
                                                  } else {
                                                      pixCodeGenerated = "Erro: ${response.error}"
                                                  }
                                              } catch (e: Exception) {
                                                  pixCodeGenerated = "Erro ao conectar: ${e.message}"
                                              } finally {
                                                  isLoading = false
                                              }
                                          }
                                      }, modifier = Modifier.weight(1f).height(50.dp).graphicsLayer { scaleX = pulseAnim; scaleY = pulseAnim }, colors = ButtonDefaults.buttonColors(containerColor = DarkGreen), shape = RoundedCornerShape(25.dp)) { 
                                          if (isLoading) CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                                          else Text("Agora", fontWeight = FontWeight.Bold) 
                                      }
                                }
                            }
                        } else {
                            Text("Tudo certo! Seus números foram reservados para a Fralda + Mimo.", textAlign = TextAlign.Center)
                            Spacer(modifier = Modifier.height(16.dp))
                            Button(onClick = { onConfirm(name, phone, "MIMO") }, modifier = Modifier.fillMaxWidth().height(50.dp).graphicsLayer { scaleX = pulseAnim; scaleY = pulseAnim }, colors = ButtonDefaults.buttonColors(containerColor = DarkGreen), shape = RoundedCornerShape(25.dp)) { Text("FINALIZAR RESERVA", fontWeight = FontWeight.Bold) }
                        }
                    }
                }
            }
        },
        confirmButton = {
            if (step < 3) {
                val isEnabled = if (step == 1) name.isNotBlank() && phone.filter { it.isDigit() }.length >= 11 else true
                Button(onClick = { step++ }, enabled = isEnabled, modifier = Modifier.height(45.dp), colors = ButtonDefaults.buttonColors(containerColor = DarkGreen)) { Text("Avançar", fontWeight = FontWeight.Bold) }
            }
        },
        dismissButton = {
            TextButton(onClick = { if (step > 1) step-- else onDismiss() }) { Text(if (step > 1) "Voltar" else "Cancelar", color = Color.Gray) }
        }
    )
}
