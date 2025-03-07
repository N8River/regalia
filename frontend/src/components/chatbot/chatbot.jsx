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
      }, 2500);
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
    <motion.div className="chatbotWrapper">
      {/* Floating Chat Icon - Smooth Appearance */}
      {!isOpen && isFullyClosed && (
        <motion.div
          className="chatbotIcon"
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
          <div className="regbotIcon">
            <SiIrobot />
          </div>
          <span className="chatbotTooltip">Need Help?</span>
        </motion.div>
      )}

      {/* Animated Chatbox */}
      <AnimatePresence
        onExitComplete={() => setIsFullyClosed(true)} // ✅ Only show icon after chatbox is gone
      >
        {isOpen && (
          <motion.div
            className="chatbotContainer"
            initial={{
              opacity: 0,
              scale: 0.6,
              transformOrigin: "bottom right",
            }} // Start small from bottom-right
            animate={{ opacity: 1, scale: 1, transformOrigin: "bottom right" }} // Grow to full size
            exit={{ opacity: 0, scale: 0.6, transformOrigin: "bottom right" }} // Shrink back to the corner
            transition={{ duration: 0.25, ease: "easeInOut" }} // Smooth animation
          >
            <div className="chatbotHeader">
              <IoMdClose
                className="chatbotHeaderCloseBtn"
                size={20}
                onClick={() => setIsOpen(false)}
              />
              <div className="regbotIconWrapper">
                <div className="regbotIconCircle">
                  <SiIrobot className="regbotIcon" />
                </div>
                <h4>RegBot</h4>
              </div>
            </div>

            <div className="chatbotMessages">
              {messages.length === 0 && (
                <div className="chatbotFaq">
                  <p>Ask me about:</p>
                  <button
                    onClick={() => setInput("What’s your refund policy?")}
                  >
                    Refund Policy
                  </button>
                  <button onClick={() => setInput("Do you ship worldwide?")}>
                    Shipping Info
                  </button>
                  <button
                    onClick={() => setInput("What materials do you use?")}
                  >
                    Jewelry Materials
                  </button>
                </div>
              )}

              {messages.map((msg, index) =>
                msg.role === "bot" ? (
                  <div className="botMessage" key={index}>
                    <div className="regbotIconMessage">
                      <SiIrobot />
                    </div>
                    <div className={`message ${msg.role}`}>
                      {msg.text}

                      {/* If the message object contains product suggestions, render them separately */}
                      {msg.recommendations &&
                        msg.recommendations.length > 0 && (
                          <div className="productRecommendations">
                            {msg.recommendations.map((product, idx) => (
                              <button
                                key={idx}
                                className="viewProductBtn"
                                onClick={() =>
                                  navigate(`/collection/${product.productId}`)
                                }
                              >
                                {product.title.toUpperCase()} - ₹{product.price}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div key={index} className={`message ${msg.role}`}>
                    {msg.text}
                  </div>
                )
              )}

              {loading && (
                <div className="botMessage">
                  <div className="regbotIconMessage">
                    <SiIrobot />
                  </div>
                  <div className="message bot">Thinking...</div>
                </div>
              )}

              <div ref={messagesEndRef}></div>
            </div>

            <div className="chatbotInput">
              <input
                type="text"
                placeholder="Ask me about Regalia..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage} disabled={loading}>
                <TbSend2 className={`${input.length == 0 ? "empty" : ""}`} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Chatbot;
