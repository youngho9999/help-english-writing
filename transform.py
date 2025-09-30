import nltk

def split_article(article):
    sentences =  nltk.sent_tokenize(article)
    filtered_sentences = [sent for sent in sentences if len(sent.split()) > 4]
    return filtered_sentences