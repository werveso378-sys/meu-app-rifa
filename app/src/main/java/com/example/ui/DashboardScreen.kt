package com.example.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Settings
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalContext
import android.content.Intent
import com.example.R
import com.example.data.Ticket

@Composable
fun DashboardScreen(
    tickets: List<Ticket>,
    onAdminClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val totalTickets = tickets.size
    val soldTickets = tickets.count { it.ownerName != null }
    val availableTickets = totalTickets - soldTickets
    
    val totalPix = tickets.count { it.paymentType == "PIX" }
    val totalMimos = tickets.count { it.paymentType == "MIMO" }
    
    val paidCount = tickets.count { it.isPaid }
    val pendingCount = soldTickets - paidCount

    LazyColumn(
        modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(20.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        item {
            HeaderSection(onAdminClick)
        }
        
        item {
            Text(
                "Resumo da Rifa", 
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                StatCard(
                    title = "Vendidos",
                    value = soldTickets.toString(),
                    iconRes = R.drawable.anim_bear_sitting,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Disponíveis",
                    value = availableTickets.toString(),
                    iconRes = R.drawable.anim_diaper_1,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            Text(
                "Status Financeiro", 
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(top = 8.dp)
            )
            Spacer(modifier = Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                StatCard(
                    title = "Pix Recebidos",
                    value = "${tickets.count { it.paymentType == "PIX" && it.isPaid }} / ${tickets.count { it.paymentType == "PIX" }}",
                    iconRes = R.drawable.anim_pix,
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Mimos Recebidos",
                    value = "${tickets.count { it.paymentType == "MIMO" && it.isPaid }} / ${tickets.count { it.paymentType == "MIMO" }}",
                    iconRes = R.drawable.anim_bag,
                    modifier = Modifier.weight(1f)
                )
            }
            Spacer(modifier = Modifier.height(24.dp))
            val context = LocalContext.current
            Button(
                onClick = {
                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                        type = "text/plain"
                        putExtra(Intent.EXTRA_SUBJECT, "Participe da Nossa Rifa!")
                        putExtra(Intent.EXTRA_TEXT, "Compre seu número da rifa e concorra a prêmios incríveis!\nAcesse: https://meu-app-rifa.vercel.app")
                    }
                    context.startActivity(Intent.createChooser(shareIntent, "Compartilhar Link da Rifa"))
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
            ) {
                Text("🔗 Compartilhar Link da Rifa (Web)", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun HeaderSection(onAdminClick: () -> Unit) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
        modifier = Modifier.fillMaxWidth().height(160.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxSize().padding(24.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    "Chá Rifa",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
                Text(
                    "Acompanhe o progresso",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                )
            }
            Column(horizontalAlignment = Alignment.End) {
                IconButton(onClick = onAdminClick) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = "Configurações",
                        tint = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Image(
                    painter = painterResource(id = R.drawable.anim_bear_sitting),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(60.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                )
            }
        }
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    iconRes: Int?,
    modifier: Modifier = Modifier,
    emoji: String? = null
) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = modifier.height(130.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                    modifier = Modifier.weight(1f)
                )
                if (iconRes != null) {
                    Image(
                        painter = painterResource(id = iconRes),
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                    )
                } else if (emoji != null) {
                    Text(text = emoji, style = MaterialTheme.typography.headlineSmall)
                }
            }
            Text(
                text = value,
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}
