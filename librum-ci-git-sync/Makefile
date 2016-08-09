all: clean binary

binary: main.go
	export GOPATH=$(pwd)
	godep save ./...
	CGO_ENABLED=0 GOOS=linux godep go build -a -installsuffix cgo -ldflags '-w' -o git-sync

test: clean binary
	go test

clean:
	rm -f git-sync || true
