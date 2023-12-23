#run
run() {
    npm run build
    echo built
    cp -R ./build/. ../../geoffcox.github.io/demos/trie-search
    echo copied
}

run