import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, 
  });

  const clientRef = useRef(null);
  
  useEffect(() => {
    if (!tokenData?.token || !authUser) {
      setLoading(true);
      return;
    }

    const initChat = async () => {
      setLoading(true);

      try {
        // console.log("Initializing stream chat client...");
        
        if (clientRef.current) {
          console.log("Cleaning up existing client...");
          try {
            await clientRef.current.disconnectUser();
          } catch (err) {
            console.log("Error during disconnect:", err);
          }
          clientRef.current = null;
        }

        const client = new StreamChat(STREAM_API_KEY);
        clientRef.current = client;
        
        // Connect user to Stream
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );
        
        if (client.user) {
          console.log("User connected successfully:", client.user.id);
          
          const channelId = [authUser._id, targetUserId].sort().join("-");
          const currChannel = client.channel("messaging", channelId, {
            members: [authUser._id, targetUserId],
          });

          await currChannel.watch();
          
          setChatClient(client);
          setChannel(currChannel);
        } else {
          throw new Error("Failed to connect user to Stream");
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
        
        if (clientRef.current) {
          try {
            await clientRef.current.disconnectUser();
          } catch (e) {
            console.log("Cleanup error:", e);
          }
          clientRef.current = null;
        }
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (clientRef.current) {
        console.log("Disconnecting on unmount");
        const client = clientRef.current;
        setTimeout(() => {
          client.disconnectUser()
            .then(() => console.log("Disconnected successfully"))
            .catch(err => console.error("Error during cleanup:", err));
        }, 0);
      }
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;