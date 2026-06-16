"use client";

import React, { useEffect, useState, useRef } from "react";
import { Capacitor } from '@capacitor/core';
import OneSignal from '@onesignal/capacitor-plugin';
import { toast } from "sonner";
import { Smartphone, CheckCircle2, QrCode, CreditCard, Receipt } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export default function ReceiverApp() {
	const [activeNotification, setActiveNotification] = useState<any>(null);
	const [isWaiting, setIsWaiting] = useState(true);
	const { width, height } = useWindowSize();
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		audioRef.current = new Audio("/sounds/notification.mp3");

		const initOneSignal = async () => {
			if (Capacitor.isNativePlatform()) {
				// Initialize OneSignal
				OneSignal.initialize("4328a8ae-8f0c-4ed5-a964-b5dd5c76f276");
				
				// Request permissions
				OneSignal.Notifications.requestPermission(true);

				// Listen for foreground notifications
				OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
					// Prevent the default OS banner from showing if you want custom UI
					event.preventDefault();

					const data = event.getNotification().additionalData;
					const sale = data || { type: "Desconhecido", amount: 0.00 };
					
					// Play sound
					if (audioRef.current) {
						audioRef.current.currentTime = 0;
						audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
					}

					setIsWaiting(false);
					setActiveNotification(sale);
					
					if (typeof navigator !== "undefined" && navigator.vibrate) {
						navigator.vibrate([200, 100, 200]);
					}

					setTimeout(() => {
						setActiveNotification(null);
						setIsWaiting(true);
					}, 6000);
				});
			} else {
				console.log("OneSignal not initialized: Not a native platform");
			}
		};

		initOneSignal();

		return () => {
			if (Capacitor.isNativePlatform()) {
				OneSignal.Notifications.removeEventListener('foregroundWillDisplay', () => {});
			}
		};
	}, []);

	// Enable audio context on first click for mobile browsers
	const enableAudio = () => {
		if (audioRef.current) {
			audioRef.current.play().then(() => {
				audioRef.current?.pause();
				audioRef.current!.currentTime = 0;
				toast.success("Áudio ativado!");
			}).catch(e => console.log(e));
		}
	};

	const getIcon = (type: string) => {
		switch (type) {
			case "Pix": return <QrCode size={32} className="text-emerald-500" />;
			case "Cartão de Crédito": return <CreditCard size={32} className="text-blue-500" />;
			case "Boleto": return <Receipt size={32} className="text-orange-500" />;
			default: return <CheckCircle2 size={32} className="text-emerald-500" />;
		}
	};

	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
			{/* Top nav */}
			<div className="absolute top-4 left-4 z-50">
				<Link href="/" className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-gray-400 px-4 py-2 rounded-full text-xs transition-colors border border-zinc-800">
					← Voltar ao Simulador Web
				</Link>
			</div>

			{/* Audio enable prompt for mobile */}
			<div className="absolute top-4 right-4 z-50">
				<button onClick={enableAudio} className="text-xs text-gray-500 underline">
					Ativar Áudio
				</button>
			</div>

			{/* Background pulsing circle when waiting */}
			<div className={`absolute w-96 h-96 rounded-full mix-blend-screen filter blur-[100px] opacity-20 transition-all duration-1000 ${isWaiting ? 'bg-zinc-600 animate-pulse' : 'bg-emerald-500 scale-150'}`}></div>

			{/* Default View */}
			{isWaiting && (
				<div className="flex flex-col items-center gap-4 text-zinc-500 z-10 transition-opacity duration-500">
					<Smartphone size={48} className="animate-bounce" />
					<p className="text-sm font-medium tracking-wide">Aguardando notificações de vendas...</p>
				</div>
			)}

			{/* Active Notification View */}
			{!isWaiting && activeNotification && (
				<div className="z-10 w-full max-w-sm animate-in fade-in slide-in-from-bottom-10 duration-500">
					<Confetti width={width} height={height} recycle={false} numberOfPieces={200} />
					
					<div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 p-6 rounded-3xl shadow-2xl shadow-emerald-900/20 flex flex-col items-center text-center space-y-4">
						<div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center shadow-inner mb-2">
							{getIcon(activeNotification.type)}
						</div>
						
						<h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
							Venda Aprovada!
						</h2>
						
						<div className="space-y-1">
							<p className="text-4xl font-black text-white tracking-tighter">
								R$ {activeNotification.amount.toFixed(2).replace('.', ',')}
							</p>
							<p className="text-sm text-zinc-400 font-medium">
								Forma de pagamento: <span className="text-zinc-200">{activeNotification.type}</span>
							</p>
						</div>
						
						<div className="w-full h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden">
							<div className="h-full bg-emerald-500 rounded-full animate-[shrink_6s_linear_forwards]" style={{ width: '100%' }}></div>
						</div>
					</div>
				</div>
			)}

			<style dangerouslySetInnerHTML={{__html: `
				@keyframes shrink {
					from { width: 100%; }
					to { width: 0%; }
				}
			`}} />
		</div>
	);
}
