# PIMaaS
Persisted and Identified Metadata as a Service (PIMaaS) demo as a means of starting a discussion. Please see [PID-U-LIKE](https://docs.google.com/presentation/d/e/2PACX-1vRKSMH33nwPaXUQFQmGsWOFFQePRW5-C7cpbLFeOBFydNWkyELPGeauRgXSJXi8a_Upjn_qA8iuCaA0/pub?start=false&loop=false&delayms=3000) presentation for ideas behind this demo/prototype.

## API documentation
See `/docs` when API application is running.

## Identifier format 

    [protocol][domain]/pims/[name space]/[PIM ID]

For example:

    http://localhost:10010/pims/FestivalSchema/7b4a184082864f966e0375a605246dee445141e96006940097fb1983ddec4182

## Dev there are two directories with READMEs detailing how to deploy locally.

 * bigChainDB - Fancy pants blockchain like persistence layer. Required for this project. See 
   [bigChainDB/README.md](bigChainDB/README.md) for installing and running. 

 * api_0.0.1 - swagger enabled rest service. Swagger UI contains the rest API documentation and service for running rest API. See 
   [api_0.0.1/README.md](api_0.0.1/README.md) for installing and running.

# Quick Examples

## Get credentials

Request

    curl http://localhost:10010/ed25519Keypair?pretty
    
Response

    {
      "publicKey": "5X3KdPJK2RTrkun74DDGMoZjgutsh9FNNWTefY5xmMG5",
      "privateKey": "GWaS4v5a2Wog6gjomwkTLV2p3aMZ3GTULE5DAtXWMVPt"
    }

## Define a set of PIMs by providing a JSON schema

Request to register a schema. 

    curl -v -H  "Content-Type: application/json"  \
    -H"publicKey: H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH" \
    -H"privateKey: FHXs4Q84SZWSj3E62gNjjemYve3PMPAqgfavzTEtBTTX"  \
    -d '{"name":"FestivalSchema", "schema": {}}' \
        "http://localhost:10010/sets?pretty"

Response note header returns schema/set/namespace ID 

    *   Trying ::1...
    * TCP_NODELAY set
    * Connected to localhost (::1) port 10010 (#0)
    > POST /sets?pretty HTTP/1.1
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
    < Location: /sets/4c3dd66508b94dd255f8813dd3c6c195c759faec59fec3ca122010c9af3569dc
    < Content-Type: application/json; charset=utf-8
    < Content-Length: 46
    < ETag: W/"2e-igkGJU+kmRvyjjuVTPEe7dxR0rc"
    < Date: Tue, 23 Jan 2018 03:46:04 GMT
    < Connection: keep-alive
    < 
    {
      "name": "FestivalSchema",
      "schema": {}
    * Connection #0 to host localhost left intact
    }

## Get a Schema

Request

        curl -H "Content-Type: application/json" \
        "http://localhost:10010/sets/7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786"
 
Response

        {"name":"FestivalSchema","schema":{}}

## Add a PIM
Request

    curl -v -H  "Content-Type: application/json" \
    -H"publicKey: H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH" \
    -H"privateKey: FHXs4Q84SZWSj3E62gNjjemYve3PMPAqgfavzTEtBTTX"  \
    -d '
            {                                                                                      
               "schemaId":"7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786",
               "metadata":{  
                  "@context":"http://schema.org",
                  "@type":"Festival",
                  "name":"PIDapalooza",
                  "startDate":"2018-01-18",
                  "endDate":"2018-01-19",
                  "performer":{  
                     "@type":"Person",
                     "@id":"https://orcid.org/0000-0002-0036-9460",
                     "name":"Rob Peters"
                  }
               }
            }
    ' \
    "http://localhost:10010/pims?pretty"

Response

    *   Trying ::1...
    * TCP_NODELAY set
    * Connected to localhost (::1) port 10010 (#0)
    > POST /pims?pretty HTTP/1.1
    > Host: localhost:10010
    > User-Agent: curl/7.54.0
    > Accept: */*
    > Content-Type: application/json
    > publicKey: H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH
    > privateKey: FHXs4Q84SZWSj3E62gNjjemYve3PMPAqgfavzTEtBTTX
    > Content-Length: 740
    > 
    * upload completely sent off: 740 out of 740 bytes
    < HTTP/1.1 201 Created
    < X-Powered-By: Express
    < Access-Control-Allow-Origin: *
    < Location: /pims/FestivalSchema/3450898127c7c191b47281fea4007c1068cd47ee488e5756b2a329b6ff665ff3
    < Content-Type: application/json; charset=utf-8
    < Content-Length: 385
    < ETag: W/"181-DzSmUdaXW8rW0R2NJQmmuxCy8zY"
    < Date: Tue, 23 Jan 2018 03:50:17 GMT
    < Connection: keep-alive
    < 
    {
      "schemaId": "7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786",
      "metadata": {
        "@context": "http://schema.org",
        "@type": "Festival",
        "name": "PIDapalooza",
        "startDate": "2018-01-18",
        "endDate": "2018-01-19",
        "performer": {
          "@type": "Person",
          "@id": "https://orcid.org/0000-0002-0036-9460",
          "name": "Rob Peters"
        }
      }
    * Connection #0 to host localhost left intact
    }

## Get a PIM
Request

    curl -H "Content-Type: application/json" \
    "http://localhost:10010/pims/FestivalSchema/7b4a184082864f966e0375a605246dee445141e96006940097fb1983ddec4182?pretty"

Response

    {
      "schemaId": "7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786",
      "metadata": {
        "@context": "http://schema.org",
        "@type": "Festival",
        "name": "PIDapalooza",
        "startDate": "2018-01-18",
        "endDate": "2018-01-19",
        "performer": {
          "@type": "Person",
          "@id": "https://orcid.org/0000-0002-0036-9460",
          "name": "Rob Peters"
        }
      }
    }

## See transaction detail

    curl "http://localhost:10010/transactions/7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786?pretty"

Response

    {
      "supersedByTx": null,
      "tx": {
        "inputs": [
          {
            "owners_before": [
              "H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH"
            ],
            "fulfills": null,
            "fulfillment": "pGSAIO8L07sWS_LhRqxAz1P9bknAnHSiMYIloRn_XhD2zcDygUDhU1n3jT0mG_KRasIhjgDeOPIflADB5VXHT5PAgzXfwE2KNG24K6wgGmoOAgOcUcOadWu21HB-zCliGEBEUP0P"
          }
        ],
        "outputs": [
          {
            "public_keys": [
              "H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH"
            ],
            "condition": {
              "details": {
                "type": "ed25519-sha-256",
                "public_key": "H68uBZ4GrrxiyKnbuANUUKRS6KfFbgFDy47ZXDLmRJUH"
              },
              "uri": "ni:///sha-256;Ow3ypTB-XUutOSDu_VPQt0dM113te0W6NFrRWE_MtBQ?fpt=ed25519-sha-256&cost=131072"
            },
            "amount": "1"
          }
        ],
        "operation": "CREATE",
        "metadata": {
          "isSet": true,
          "setName": "FestivalSchema"
        },
        "asset": {
          "data": {
            "name": "FestivalSchema",
            "schema": {}
          }
        },
        "version": "1.0",
        "id": "7dff6919c2fec5d81cf5036ae6e7d56d6d59be25f372db711b12b82d324b2786"
      }
    }

## Not yet implemented but should be
Update, merge, split and deprecate.

