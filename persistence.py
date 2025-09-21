import psycopg2
import os
from dotenv import load_dotenv

def insert_sentence(sentences,difficulty_level,source):
    load_dotenv()
    conn = None
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )

        cur = conn.cursor()

        sql = "INSERT INTO engpt.sentences (english_sentence, difficulty_level,source) VALUES (%s, %s, %s);"

        for sentence in sentences:
            clean_sentence = sentence.strip()
            if clean_sentence:
                cur.execute(sql, (clean_sentence, difficulty_level, source))

        conn.commit()
        cur.close()

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        if conn is not None:
            conn.rollback()

    finally:
        if conn is not None:
            conn.close()
            print("데이터베이스 연결이 닫혔습니다.")