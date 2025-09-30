from persistence import insert_sentence
from transform import split_article

if __name__ == "__main__":

    difficulty = 2
    source = ""

    article = """
    """


    split_sentences = split_article(article)
    insert_sentence(split_sentences, difficulty, source)
