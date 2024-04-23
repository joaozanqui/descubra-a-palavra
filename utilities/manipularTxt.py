with open('./words.txt', 'r') as file:
    content = file.read()

    words = content.split()

    qtdPalavras = [0] * 23

    for word in words:
        if(len(word) == 23):
            print(word)

    # for word in words:
    #     qtdPalavras[len(word) -1 ] = qtdPalavras[len(word)-1] + 1
    
    # for i in range(0, 23):
    #     print(f"{i+1} - {qtdPalavras[i]}")
    