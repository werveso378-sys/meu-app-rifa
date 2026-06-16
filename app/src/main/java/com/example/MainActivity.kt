package com.example

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.google.firebase.firestore.FirebaseFirestore
import com.example.data.TicketRepository
import com.example.ui.AppScreen
import com.example.ui.MainViewModel
import com.example.ui.MainViewModelFactory
import com.example.ui.theme.MyApplicationTheme
import android.Manifest
import android.app.AlertDialog
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.util.Log
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.firestore.SetOptions

class MainActivity : ComponentActivity() {

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            Log.d("MainActivity", "Permissão de notificação concedida")
            Toast.makeText(this, "🔔 Notificações ativadas com sucesso!", Toast.LENGTH_SHORT).show()
        } else {
            Log.d("MainActivity", "Permissão de notificação negada")
            // Show dialog explaining why notifications are important
            showNotificationExplanationDialog()
        }
    }

    private val viewModel: MainViewModel by viewModels {
        val firestore = FirebaseFirestore.getInstance()
        val repo = TicketRepository(firestore)
        MainViewModelFactory(repo)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        askNotificationPermission()
        setupFCMToken()

        setContent {
            MyApplicationTheme {
                AppScreen(viewModel = viewModel)
            }
        }
    }

    override fun onResume() {
        super.onResume()
        checkNotificationStatus()
    }

    private fun checkNotificationStatus() {
        val areEnabled = androidx.core.app.NotificationManagerCompat.from(this).areNotificationsEnabled()
        if (!areEnabled) {
            showNotificationExplanationDialog()
        }
    }

    private fun askNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            } else {
                checkNotificationStatus()
            }
        } else {
            checkNotificationStatus()
        }
    }

    private var dialogShown = false

    private fun showNotificationExplanationDialog() {
        if (dialogShown) return
        dialogShown = true

        AlertDialog.Builder(this)
            .setTitle("🔔 Notificações são essenciais!")
            .setMessage(
                "Para acompanhar as vendas da sua Chá Rifa Baby em tempo real, é obrigatório ativar as notificações.\n\n" +
                "Você será notificado quando:\n" +
                "• Um Pix for gerado 💸\n" +
                "• Um pagamento for confirmado 💰\n" +
                "• Uma reserva de mimo for feita 🎁\n\n" +
                "Deseja ativar agora?"
            )
            .setPositiveButton("Ativar nas Configurações") { _, _ ->
                dialogShown = false
                val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                    putExtra(Settings.EXTRA_APP_PACKAGE, packageName)
                }
                startActivity(intent)
            }
            .setNegativeButton("Depois") { dialog, _ ->
                dialogShown = false
                dialog.dismiss()
                Toast.makeText(this, "⚠️ Você não receberá alertas de vendas!", Toast.LENGTH_LONG).show()
            }
            .setCancelable(false)
            .show()
    }

    private fun setupFCMToken() {
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (!task.isSuccessful) {
                Log.w("MainActivity", "Fetching FCM registration token failed", task.exception)
                return@addOnCompleteListener
            }
            val token = task.result
            Log.d("MainActivity", "FCM Token no boot: $token")
            val db = FirebaseFirestore.getInstance()
            val data = hashMapOf("fcmToken" to token)
            db.collection("settings").document("global")
                .set(data, SetOptions.merge())
                .addOnSuccessListener { Log.d("FCM", "Token salvo no boot com sucesso") }
        }
    }
}
