# PIMaaS
Persisted and Identified Metadata as a Service (PIMaaS) demo as a means of starting a discussion. Please see [PID-U-LIKE](https://docs.google.com/presentation/d/e/2PACX-1vRKSMH33nwPaXUQFQmGsWOFFQePRW5-C7cpbLFeOBFydNWkyELPGeauRgXSJXi8a_Upjn_qA8iuCaA0/pub?start=false&loop=false&delayms=3000) representation for ideas behind this demo/prototype.

## API documentation
See `/docs` when API application is running.

## Identifier format 

[protocol][domain]/pims/[name space]/[PIM ID]

For example:
`http://localhost:10010/pims/FestivalSchema/7b4a184082864f966e0375a605246dee445141e96006940097fb1983ddec4182`

## Dev there are two directories with READMEs detailing how to deploy locally.

 * bigChainDB - Fancy pants blockchain like persistence layer. Required for this project. See 
   [bigChainDB/README.md](bigChainDB/README.md) for installing and running. 

 * api_0.0.1 - swagger enabled rest service. Swagger UI contains the rest API documentation and service for running rest API. See 
   [api_0.0.1/README.md](api_0.0.1/README.md) for installing and running.

# Quick Examples

## Get credentials

       curl http://localhost:10010/ed25519Keypair
       
       {"publicKey":"5jah46G1XRHXMsUgXGzPMQCY5b3gHEJxCBQHpLEdJWvK","privateKey":"9Vtzv4mZwa2x5WywMbyKX8ePHrnJz6hyTvtK2nSGvUs"}


## Define a set of PIMs by providing a JSON schema

        
        curl -v -H  "Content-Type: application/json" -H"publicKey: H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH" -H"privateKey: FHXs4Q84SZWSj3E62gNjjemYve3PMPAqgfavzTEtBTTX"  -d '{"name":"FestivalSchema", "schema": {}}' -X POST "http://localhost:10010/sets"
        Note: Unnecessary use of -X or --request, POST is already inferred.
        *   Trying ::1...
        * TCP_NODELAY set
        * Connected to localhost (::1) port 10010 (#0)
        > POST /sets HTTP/1.1
        > Host: localhost:10010
        > User-Agent: curl/7.54.0
        > Accept: */*
        > Content-Type: application/json
        > publicKey: H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH
        > privateKey: FHXs4Q84SZWSj3E62gNjjemYve3PMPAqgfavzTEtBTTX
        > Content-Length: 39
        > 
        * upload completely sent off: 39 out of 39 bytes
        < HTTP/1.1 201 Created
        < X-Powered-By: Express
        < Access-Control-Allow-Origin: *
        < Location: /sets/7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786
        < Content-Type: application/json; charset=utf-8
        < Content-Length: 37
        < ETag: W/"25-zCkTmvAx/3n/VI/UL4KSC0MohB8"
        < Date: Fri, 19 Jan 2018 19:50:12 GMT
        < Connection: keep-alive
        < 
        * Connection #0 to host localhost left intact
        {"name":"FestivalSchema","schema":{}}


## Get a Schema

        curl -H "Content-Type: application/json" "http://localhost:10010/sets/7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786"
        {"name":"FestivalSchema","schema":{}}

## Add a PIM

        curl -v -H  "Content-Type: application/json" -H"publicKey: H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH" -H"privateKey: FHXs4Q84SZWSj3E62gNjjemYve3PMPAqgfavzTEtBTTX"  -d '{ "schemaId":"7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786", "metadata":{"@context": "http://schema.org","@type": "Festival","name": "PIDapalooza","startDate": "2018-01-18","endDate": "2018-01-19","performer": {"@type": "Person","@id": "https://orcid.org/0000-0002-0036-9460","name": "Rob Peters"}}}' -X POST "http://localhost:10010/pims"
        Note: Unnecessary use of -X or --request, POST is already inferred.
        *   Trying ::1...
        * TCP_NODELAY set
        * Connected to localhost (::1) port 10010 (#0)
        > POST /pims HTTP/1.1
        > Host: localhost:10010
        > User-Agent: curl/7.54.0
        > Accept: */*
        > Content-Type: application/json
        > publicKey: H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH
        > privateKey: FHXs4Q84SZWSj3E62gNjjemYve3PMPAqgfavzTEtBTTX
        > Content-Length: 319
        > 
        * upload completely sent off: 319 out of 319 bytes
        < HTTP/1.1 201 Created
        < X-Powered-By: Express
        < Access-Control-Allow-Origin: *
        < Location: /pims/FestivalSchema/7b4a184082864f966e0375a605246dee445141e96006940097fb1983ddec4182
        < Content-Type: application/json; charset=utf-8
        < Content-Length: 308
        < ETag: W/"134-PXkpfhuhfB5SxnrPRVIH90wrifg"
        < Date: Fri, 19 Jan 2018 20:06:11 GMT
        < Connection: keep-alive
        < 
        * Connection #0 to host localhost left intact
        {"schemaId":"7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786","metadata":{"@context":"http://schema.org","@type":"Festival","name":"PIDapalooza","startDate":"2018-01-18","endDate":"2018-01-19","performer":{"@type":"Person","@id":"https://orcid.org/0000-0002-0036-9460","name":"Rob Peters"}}}

## Get a PIM

        curl -H "Content-Type: application/json" "http://localhost:10010/pims/FestivalSchema/7b4a184082864f966e0375a605246dee445141e96006940097fb1983ddec4182"
        {"schemaId":"7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786","metadata":{"@context":"http://schema.org","@type":"Festival","name":"PIDapalooza","startDate":"2018-01-18","endDate":"2018-01-19","performer":{"@type":"Person","@id":"https://orcid.org/0000-0002-0036-9460","name":"Rob Peters"}}}

## See transaction detail

        curl -H "Content-Type: application/json" "http://localhost:10010/transactions/7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786"
        {"inputs":[{"owners_before":["H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH"],"fulfills":null,"fulfillment":"pGSAIO8L07sWS_LhRqxAz1P9bknAnHSiMYIloRn_XhD2zcDygUDhU1n3jT0mG_KRasIhjgDeOPIflADB5VXHT5PAgzXfwE2KNG24K6wgGmoOAgOcUcOadWu21HB-zCliGEBEUP0P"}],"outputs":[{"public_keys":["H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH"],"condition":{"details":{"type":"ed25519-sha-256","public_key":"H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH"},"uri":"ni:///sha-256;Ow3ypTB-XUutOSDu_VPQt0dM113te0W6NFrRWE_MtBQ?fpt=ed25519-sha-256&cost=131072"},"amount":"1"}],"operation":"CREATE","metadata":{"isSet":true,"setName":"FestivalSchema"},"asset":{"data":{"name":"FestivalSchema","schema":{}}},"version":"1.0","id":"7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786"}

## Supersede a PIM


## Supersede a set
