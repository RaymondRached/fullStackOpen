sequenceDiagram
    participant browser
    participant server

Note right of browser: The event handler add the new note to the note list and rerenders it

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Success message in JSON format {"message":"note created"}
    deactivate server

