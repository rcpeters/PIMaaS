# PIMaaS
Persisted and Identified Metadata as a Service (PIMaaS) demo as a means of starting a discussion. Please see [PID-U-LIKE](https://docs.google.com/presentation/d/e/2PACX-1vRKSMH33nwPaXUQFQmGsWOFFQePRW5-C7cpbLFeOBFydNWkyELPGeauRgXSJXi8a_Upjn_qA8iuCaA0/pub?start=false&loop=false&delayms=3000) representation for ideas behind this demo/prototype.


## Dev there are two directories with READMEs detailing how to deploy locally.

 * bigChainDB - Fancy pants blockchain like persistence layer. Required for this project. See 
   [bigChainDB/README.md](bigChainDB/README.md) for installing and running. 

 * api_0.0.1 - swagger enabled rest service. Swagger UI contains the rest API documentation and service for running rest API. See 
   [api_0.0.1/README.md](api_0.0.1/README.md) for installing and running.

# Examples

## Quickly get credentials

           curl http://localhost:10010/ed25519Keypair
           {"publicKey":"5jah46G1XRHXMsUgXGzPMQCY5b3gHEJxCBQHpLEdJWvK","privateKey":"9Vtzv4mZwa2x5WywMbyKX8ePHrnJz6hyTvtK2nSGvUs"}


## Quickly define a set of PIMs by providing a JSON schema

## Quickly add PIM

## Supersede a PIM

## Supersede at set
