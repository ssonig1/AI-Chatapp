import Navbar from '../../components/navbar/Navbar'
import insert from '../../assets/insert.svg'
import send from '../../assets/send.svg'
import videoimage from '../../assets/image.png'
import video_icon from '../../assets/video-icon.png'
import pause_icon from '../../assets/pause-icon.png'
import play_icon from '../../assets/play_icon.png'
import './room.css'

import { useState, useEffect,useRef } from 'react';


const Room =()=>{
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [image,setImage] = useState(play_icon)
    const chatDisplayRef = useRef(null);
    const [speech,setSpeech] = useState('false');

    const sendMessage = (event)=>{
        if(message){
        event.preventDefault();
        
        console.log([messages])
        console.log([message])
        fetch('http://localhost:3000/sendMessage', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setMessages([...messages,{role : 'user',content :message},{role : 'ai',content :data}]);
            let speech = new SpeechSynthesisUtterance();
            speech.text = data;
            window.speechSynthesis.speak(speech);
            })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    setMessage('');
    }
    
    useEffect(() => {
        chatDisplayRef.current?.scrollTo(0, chatDisplayRef.current?.scrollHeight);
        }, [messages]);


    const speechToText = () => {
        setSpeech(speech ? 'false' : 'true');
        setImage((prevImage) => (prevImage === play_icon ? pause_icon : play_icon));
        window.SpeechRecognition = window.webkitSpeechRecognition
        if ('SpeechRecognition' in window) {
            const recognition = new window.SpeechRecognition();
            recognition.interimResults = true;
        
            recognition.addEventListener('result', (e) => {
            const transcript = Array.from(e.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                
            console.log(transcript);
            setMessage( transcript);
            });
        
            if (speech) recognition.start();
        } else {
            console.error('SpeechRecognition is not supported');
        }
        };
    
        
    return(
        <div className="room-body">
            <Navbar/>
            <div className="room-container ">
                <div className="room-chatbox box">
                    <div className="chat-display" ref={chatDisplayRef}>
                    {messages.map((msg, index) => (
                    <p key={index} className="chat-para" style ={{display : 'flex',flexDirection : (msg.role=='ai')?'row':'row-reverse'}}>{msg.content}</p>
                ))}
                    </div>
                    <div className="chat-controller">
                        <input type="text" className="chat-input" placeholder="Type Message" value={message}
                    onChange={(e) => setMessage(e.target.value)}/>
                        <button className='chat-insert'><img src={(insert)} alt="test" /></button>
                        <button className='chat-send'><img src={(send)} alt="test" onClick={sendMessage} /></button>
                    </div>
                </div>
                <div className="room-controller">
                    <div className="video-controller box">
                        <img className="video-img" src={videoimage}/>
                        <div className="controller-icon">
                            <button className="controller-button"><img className="controller-button-img" src ={video_icon}/></button>     
                            <div className="controller-text">Video</div>
                        </div>
                    </div>
                    <div className="audio-controller box">
                        <div className ="controller-icon">
                            <button className="controller-button" onClick={speechToText} ><img className="controller-button-img" src ={image}/></button>
                            <div className ="controller-text" >Speek</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Room