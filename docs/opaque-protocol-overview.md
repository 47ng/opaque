# OPAQUE Protocol Overview

Reference: [draft-irtf-cfrg-opaque-09](https://www.ietf.org/archive/id/draft-irtf-cfrg-opaque-09.html#name-protocol-overview).

## Registration (signup)

```mermaid
sequenceDiagram
    %%{
      init: {
        "messageFontFamily": "monospace",
        "noteAlign": "left"
      }
    }%%
    accTitle: Registration
    accDescr: Sequence diagram of the OPAQUE registration protocol
    actor C as Client
    participant S as Server
    participant D as Database
    autonumber
    Note right of C: Client registration start
    activate C
    C->>+S: username, registrationRequest
    deactivate C
    Note right of S: Server registration start
    S->>D: Generate nonce<br/>Save { nonce: username }<br/>with short TTL
    S->>-C: nonce, registrationResponse
    activate C
    Note right of C: Client registration finish
    C->>+S: nonce, registrationRecord
    deactivate C
    Note right of S: Server registration finish
    S->>D: Save credentials<br/>Remove nonce
    S->>-C: HTTP 204 (No Content)
```

> _Note: registration doesn't perform key exchange/agreement,
> so a login step is necessary after signup to establish a shared key._

## Login

```mermaid
sequenceDiagram
    %%{
      init: {
        "messageFontFamily": "monospace",
        "noteAlign": "left"
      }
    }%%
    accTitle: Login
    accDescr: Sequence diagram of the OPAQUE login protocol
    actor C as Client
    participant S as Server
    participant D as Database
    autonumber
    Note right of C: Client login start
    activate C
    C->>+S: username, loginRequest
    deactivate C
    S->>+D: query user by username
    D->>-S: Obtain credentials
    Note right of S: Server login start
    S->>D: Generate nonce<br/>Save { nonce: { loginState, username } }<br/>with a short TTL
    S->>-C: nonce, loginReponse
    activate C
    Note right of C: Client login finish
    Note right of C: Now the client can<br/>access the shared key
    C->>+S: nonce, loginFinal
    deactivate C
    D->>S: Obtain { username, loginState }<br/>using the given nonce
    Note right of S: Server login finish
    Note right of S: Now the server can<br/>access the shared key
    S-->>D: Clear nonce & loginState
    S->>-C: Set cookies or return token
```
