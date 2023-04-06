'Chat Room Connection - Client-To-Client'
import threading
import socket

host = '127.0.0.1'
port = 59001
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((host, port))
server.listen()
waitingClients = {}
paredClients = {}


def forwardMessage(message, client):
    receivingClient = paredClients[client]
    receivingClient.send(message)


def handle_client(client):
    while True:
        if paredClients.get(client):
            try:
                message = client.recv(1024)
                forwardMessage(message, client)
            except:
                print("Exception in Handling Client")
                break


# Main function to receive the clients connection


def notifyClients():
    pass


def handshake(sendingClient, sendingClientName):
    print(f'handshake started for {sendingClientName}')
    if waitingClients:
        sendingClient.send(f'{waitingClients.keys()} is/are available for connection, '
                           f'please enter the client name to connect [Press W to wait]'.encode('utf-8'))
        receivingClientName = sendingClient.recv(1024).decode('utf-8')

        if receivingClientName == 'W':
            waitingClients[sendingClientName] = sendingClient
            sendingClient.send(
                f'You are being added to waitingList, other clients are notified'.encode('utf-8'))
            notifyClients()

        print(f'{sendingClientName} wants to connect to {receivingClientName}')
        receivingClient = waitingClients.get(receivingClientName)
        receivingClient.send(
            f'{sendingClientName} wants to connect with you, would you like to accept connection? (Y/N)'.encode(
                'utf-8'))
        acceptance = receivingClient.recv(1024).decode('utf-8')
        print(acceptance)
        if acceptance == 'Y':
            paredClients[sendingClient] = receivingClient
            paredClients[receivingClient] = sendingClient
            sendingClient.send(f'{receivingClientName} Handshake is Successful'.encode('utf-8'))
            receivingClient.send(f'{sendingClientName} Handshake is Successful'.encode('utf-8'))
            del waitingClients[receivingClientName]
        else:
            sendingClient.send(
                'Handshake Failed, client could be down or not available. please try again'.encode('utf-8'))
            handshake(sendingClient, sendingClientName)
    else:
        sendingClient.send(
            f'No Clients available for connection, please wait for other clients to be online'.encode('utf-8'))
        waitingClients[sendingClientName] = sendingClient
    pass


def receive():
    while True:
        print('Server is running and listening ...')
        client, address = server.accept()
        print(f'connection is established with {str(address)}')
        client.send('alias?'.encode('utf-8'))
        sendingClientName = client.recv(1024).decode('utf-8')
        client.send(f'you are now connected as {sendingClientName} \n'.encode('utf-8'))
        handshake(client, sendingClientName)
        thread = threading.Thread(target=handle_client, args=(client,))
        thread.start()
        print('handshake complete')


if __name__ == "__main__":
    receive()
