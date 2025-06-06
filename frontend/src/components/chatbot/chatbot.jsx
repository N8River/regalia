import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../../config/config";
import "./chatbot.css";
import { useNavigate } from "react-router";

import { TbMessageChatbot } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { RiRobot2Line } from "react-icons/ri";
import { SiIrobot } from "react-icons/si";
import { TbSend2 } from "react-icons/tb";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullyClosed, setIsFullyClosed] = useState(true);

  const navigate = useNavigate();

  const [isIconVisible, setIsIconVisible] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let timeout;

    const handleScroll = () => {
      if (isOpen) return; // Prevent hiding when chatbot is open

      setIsIconVisible(true); // Show icon when scrolling
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setIsIconVisible(false);
      }, 2500000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]); // Store messages locally
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.map((msg) => msg.text), // Send previous messages
        }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (data.response) {
        // Create a bot message that includes both text and recommendations
        const botMessage = {
          role: "bot",
          text: data.response,
          recommendations: data.recommendations, // Array of products
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div id="chatbotWrapper" className="fixed right-4 bottom-4 z-50">
      {/* Floating Chat Icon - Smooth Appearance */}
      {!isOpen && isFullyClosed && (
        <motion.div
          id="chatbotIcon"
          className="relative flex cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral-100 p-1 pr-3 shadow-md shadow-neutral-950/50"
          onClick={() => {
            setIsFullyClosed(false);
            setIsOpen(true);
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isIconVisible ? 1 : 0,
            scale: isIconVisible ? 1 : 0.9,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div
            id="regbotIcon"
            className="bg-primary flex size-10 items-center justify-center rounded-full text-white"
          >
            <SiIrobot className="size-5" />
          </div>
          <span id="chatbotTooltip" className="text-base">
            Need Help?
          </span>
        </motion.div>
      )}

      {/* Animated Chatbox */}
      <AnimatePresence
        onExitComplete={() => setIsFullyClosed(true)} // ✅ Only show icon after chatbox is gone
      >
        {isOpen && (
          <motion.div
            id="chatbotContainer"
            className="fixed right-4 bottom-4 flex h-[80vh] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-lg shadow-neutral-800/50 sm:h-[600px] sm:w-96"
            initial={{
              opacity: 0,
              scale: 0.6,
              transformOrigin: "bottom right",
            }} // Start small from bottom-right
            animate={{ opacity: 1, scale: 1, transformOrigin: "bottom right" }} // Grow to full size
            exit={{ opacity: 0, scale: 0.6, transformOrigin: "bottom right" }} // Shrink back to the corner
            transition={{ duration: 0.25, ease: "easeInOut" }} // Smooth animation
          >
            <div
              id="chatbotHeader"
              className="relative flex h-24 items-center justify-between border-b border-neutral-200 bg-neutral-800 p-4"
            >
              <IoMdClose
                id="chatbotHeaderCloseBtn"
                className="size-5 cursor-pointer text-neutral-100 transition-colors hover:text-neutral-400"
                onClick={() => setIsOpen(false)}
              />
              <div
                id="regbotIconWrapper"
                className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
              >
                <div
                  id="regbotIconCircle"
                  className="bg-primary flex size-10 items-center justify-center rounded-full"
                >
                  <SiIrobot className="size-5 text-white" />
                </div>
                <h4 className="pt-0.5 font-medium text-neutral-100">RegBot</h4>
              </div>
            </div>

            <div
              id="chatbotMessages"
              className="flex-1 space-y-4 overflow-y-auto p-4"
            >
              {messages.length === 0 && (
                <div id="chatbotFaq" className="">
                  <p className="mb-3 text-sm font-medium">Ask me about:</p>
                  {[
                    {
                      label: "Refund Policy",
                      query: "What's your refund policy?",
                    },
                    {
                      label: "Shipping Info",
                      query: "Do you ship worldwide?",
                    },
                    {
                      label: "Jewelry Materials",
                      query: "What materials do you use?",
                    },
                  ].map((item, index) => (
                    <button
                      key={index}
                      className="mb-2 w-full cursor-pointer rounded-md bg-neutral-200 px-4 py-2 text-left text-sm transition-colors hover:bg-neutral-300"
                      onClick={() => setInput(item.query)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, index) =>
                msg.role === "bot" ? (
                  <div id="botMessage" key={index} className="flex gap-2">
                    <div
                      id="regbotIconMessage"
                      className="bg-primary flex size-8 flex-shrink-0 items-center justify-center rounded-full"
                    >
                      <SiIrobot className="size-4 text-white" />
                    </div>
                    <div
                      className={`max-w-[70%] flex-1 rounded-lg rounded-tl-none px-3 py-2 pb-3 text-sm ${
                        msg.role === "bot"
                          ? "bg-neutral-200"
                          : "bg-primary text-white"
                      }`}
                    >
                      {msg.text}

                      {/* If the message object contains product suggestions, render them separately */}
                      {msg.recommendations &&
                        msg.recommendations.length > 0 && (
                          <div
                            id="productRecommendations"
                            className="mt-4 space-y-3"
                          >
                            {msg.recommendations.map((product, idx) => (
                              <button
                                key={idx}
                                id="viewProductBtn"
                                className="hover:bg-primary/50 w-full cursor-pointer rounded-md bg-neutral-300 px-3 py-2 text-left text-sm text-black transition-colors"
                                onClick={() =>
                                  navigate(`/collection/${product.productId}`)
                                }
                              >
                                {product.title.toUpperCase()} - ${product.price}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className={`ml-auto w-fit max-w-[70%] rounded-lg rounded-tr-none px-3 py-2 pb-3 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-neutral-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                ),
              )}

              {loading && (
                <div id="botMessage" className="flex gap-2">
                  <div
                    id="regbotIconMessage"
                    className="bg-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                  >
                    <SiIrobot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 rounded-lg bg-neutral-100 p-3">
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef}></div>
            </div>

            <div id="chatbotInput" className="border-t border-neutral-200 p-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me about Regalia..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-400 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="bg-primary hover:bg-primary-hover flex w-10 items-center justify-center rounded-md text-white transition-colors disabled:opacity-50"
                >
                  <TbSend2
                    className={`size-5 ${
                      input.length === 0 ? "opacity-30" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Chatbot;
