import './App.css';
import React, { useState } from 'react'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firease-hooks/firestore';


firebase.initializeApp({
    apiKey: "AIzaSyAFV8pozDZFVTXy0Wd6-7XrmENFCIK4dqM",
    authDomain: "chat-app-ee28b.firebaseapp.com",
    projectId: "chat-app-ee28b",
    storageBucket: "chat-app-ee28b.appspot.com",
    messagingSenderId: "739231933743",
    appId: "1:739231933743:web:414d82048fd6dc0404edda",
    measurementId: "G-EB5R8SRDCH",
})

const auth =  firebase.auth;
const firestore = firebase.firestore();


function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle} > Sign In with Google </button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()} > Sign Out </button>
  )
}


function ChatMessage(props) {
  const {text, uid, photoUrl} = props.messages;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received' ;

  return (

    <div className={`message ${messageClass}`} >
      <img src={photoUrl} alt=""/>
      <p> {text} </p>
    </div>

  )
}

function ChatRoom(){
  const messagesRef = firestore.collection('messages')   // query documents in a collection 
  const query = messagesRef.orderBy(createdAt).limit(25); 
  
  const [messages] = useCollectionData(query, {idField: 'id'}); // listen to data with a hook

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const{uid, photoURL} = auth.currentUser;
    await messagesRef.Add({
      text : formValue,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL

    });
    setFormValue('');
  }

  return(
    <>
      <div>
        {messages && messages.map(msg =>  <ChatMessage key={msg.id} message={msg} /> )} 
      </div>

      <form>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value) } />
        <button type="submit"> SUBMIT </button>
      </form>
    </>
  )
}


function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
          TNAKET Chat App
      </header>

      <section>
        {user? <ChatRoom /> : <SignIn /> }
      </section>

    </div>
  );
}

export default App;