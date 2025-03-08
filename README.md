# Docker Kubernetes Node.js Sample
An example of how to use Docker and Kubernetes in a Node.js application

![CI](https://github.com/artursilveiradev/docker-k8s-nodejs-sample/actions/workflows/main.yml/badge.svg)

## API requests 

### Create item
```
curl -X "POST" "http://localhost:3000/items" \
     -H 'Content-Type: application/json' \
     -H 'Accept: application/json' \
     -d $'{
  "name": "Buy coffee"
}'
```

### Read items
```
curl -X "GET" "http://localhost:3000/items" \
     -H 'Content-Type: application/json' \
     -H 'Accept: application/json'
```

### Update item
```
curl -X "PUT" "http://localhost:3000/items/a390da56-5078-4568-bcfc-0c535989f2f9" \
     -H 'Content-Type: application/json' \
     -H 'Accept: application/json' \
     -d $'{
  "name": "Buy coffee",
  "completed": true
}'
```

### Delete item
```
curl -X "DELETE" "http://localhost:3000/items/a390da56-5078-4568-bcfc-0c535989f2f9" \
     -H 'Content-Type: application/json' \
     -H 'Accept: application/json'
```
