import React from 'react'
import * as signalR from '@aspnet/signalr/dist/browser/signalr'

class MyChat extends React.Component{//* as 
    constructor(props){
        super(props)

        this.state = {
            nick:'',
            message: '',
            messages: [],
            hubConnection: null
        }

    }

    componentDidMount = () => {
        const nick = window.prompt('Your name:', 'John')

        const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:57778/chat")
        .configureLogging(signalR.LogLevel.Information)
        .build();

        this.setState({ connection, nick }, () => {
            this.state.connection
              .start()
              .then(() => console.log('Connection started!'))
              .catch(err => console.log('Error while establishing connection :('));
      
            this.state.connection.on('sendToAll', (nick, receivedMessage) => {
              const text = `${nick}: ${receivedMessage}`
              const messages = this.state.messages.concat([text])
              this.setState({ messages })
            })
          })
    }

    sendMessage = () => {
        this.state.connection
          .invoke('SendMessage', this.state.nick, this.state.message)
          .catch(err => console.error(err))
    
          this.setState({message: ''})
      };

      render() {
        return (
          <div>
            <br />
            <input
              type="text"
              value={this.state.message}
              onChange={e => this.setState({ message: e.target.value })}
            />
    
            <button onClick={this.sendMessage}>Send</button>
    
            <div>
              {this.state.messages.map((message, index) => (
                <span style={{display: 'block'}} key={index}> {message} </span>
              ))}
            </div>
          </div>
        );
    }
}




export default MyChat