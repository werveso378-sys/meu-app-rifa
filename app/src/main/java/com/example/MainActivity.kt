package com.example

import android.os.Bundle
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
import android.content.pm.PackageManager
import android.os.Build
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
        } else {
            Log.d("MainActivity", "Permissão de notificação negada")
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

    private fun askNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
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

