import { useState } from "preact/hooks";
import { environment } from "../environment";

import "../../styles/loading.css";

let threadId: string | null;

export default function Chat() {
	let [isVisible, setIsVisible] = useState(false);
	let [message, setMessage] = useState("");
	let [responses, setResponses] = useState<string[]>([]);
	let [loading, setLoading] = useState(false);

	const getThreadId = async () => {
		if (!threadId) {
			try {
				loading = true;
				setLoading(loading);
				const response = await fetch(`${environment.apiUrl}/thread`);
				const data = await response.json();

				return data.thread;
			} catch (error) {
				console.error("Failed to get thread", error);
				return null;
			} finally {
				loading = false;
				setLoading(loading);
			}
		}
	};

	const toggleVisibility = async () => {
		setIsVisible(!isVisible);
		if (!threadId) {
			threadId = await getThreadId();
		}
	};

	const sentMessage = async () => {
		const scrollToBottom = () => {
			setTimeout(() => {
				const el = document.getElementById("chatbot-messages");
				if (el) {
					el.scrollTop = el.scrollHeight;
				}
			}, 10);
		};

		if (message === "") {
			return;
		}

		try {
			loading = true;
			setLoading(loading);

			responses.push(message);
			setResponses([...responses]);
			scrollToBottom();

			setTimeout(async () => {
				responses.push("LOADING");
				setResponses([...responses]);
				scrollToBottom();

				const response = await fetch(`${environment.apiUrl}/message`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						thread: threadId,
						message: message,
					}),
				});
				const responseText = await response.text();

				const lastResponsesIndex = responses.length - 1;
				responses[lastResponsesIndex] = responseText;
				setResponses([...responses]);
				setMessage("");

				scrollToBottom();
				loading = false;
				setLoading(loading);
			}, 500);
		} catch (error) {
			console.error("Failed to send message", error);
		}
	};

	const handleInputChange = (event: any) => {
		setMessage(event.target.value);
	};

	return (
		<>
			<div
				class="fixed bottom-7 right-10"
				style={{ display: isVisible ? "none" : "block" }}
			>
				<a
					title="Do you need help?"
					class="cursor-pointer animate-blink-once text-teal-700"
					onClick={toggleVisibility}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<path d="M17.802 17.292s.077 -.055 .2 -.149c1.843 -1.425 3 -3.49 3 -5.789c0 -4.286 -4.03 -7.764 -9 -7.764c-4.97 0 -9 3.478 -9 7.764c0 4.288 4.03 7.646 9 7.646c.424 0 1.12 -.028 2.088 -.084c1.262 .82 3.104 1.493 4.716 1.493c.499 0 .734 -.41 .414 -.828c-.486 -.596 -1.156 -1.551 -1.416 -2.29z"></path>
						<path d="M7.5 13.5c2.5 2.5 6.5 2.5 9 0"></path>
					</svg>
				</a>
			</div>

			<div
				class="w-11/12 md:w-80 h-3/4 md:h-96 border border-slate-300 fixed bottom-7 md:right-10 right-2 rounded-2xl shadow-2xl flex-col overflow-hidden"
				style={{ display: isVisible ? "flex" : "none" }}
			>
				<div class="text-white p-3 bg-teal-600 text-xl flex items-center">
					<h1 class="flex-grow text-center">Chatbot GPT</h1>
					<a onClick={toggleVisibility} class="cursor-pointer" title="Close">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="icon icon-tabler icons-tabler-outline icon-tabler-x"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M18 6l-12 12" />
							<path d="M6 6l12 12" />
						</svg>
					</a>
				</div>
				<div
					class="p-4 bg-gray-100 flex-grow overflow-y-auto flex flex-col gap-3"
					id="chatbot-messages"
				>
					<div class="w-4/5 p-2 rounded-2xl bg-white shadow-lg">
						Hi, how can I help you today?
					</div>

					{responses.map((item, index) => (
						<div
							class={`w-4/5 p-2 rounded-2xl bg-white shadow-lg  ${
								index % 2 === 0 ? "self-end" : "self-start"
							} ${item === "LOADING" ? "animate-pulse" : ""}`}
						>
							{item === "LOADING" ? (
								<div class="loader"></div>
							) : item === "NO-ACTION" ? (
								<div>Sorry, I can not help you with that</div>
							) : (
								item
							)}
						</div>
					))}
				</div>
				<div class="p-4 bg-gray-200 flex items-center gap-2">
					<textarea
						class={`flex-grow p-2 rounded-md border-2 text-lg resize-none ${loading ? "cursor-not-allowed" : "cursor-text"}`}
						placeholder="Write your message..."
						disabled={loading}
						value={message}
						onChange={handleInputChange}
					></textarea>
					<button
						class={`border-2 border-gray-600 rounded-full p-1 text-slate-600 hover:text-slate-400 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
						title="Send message"
						onClick={sentMessage}
						disabled={loading}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
							<path d="M6.5 12h14.5" />
						</svg>
					</button>
				</div>
			</div>
		</>
	);
}
