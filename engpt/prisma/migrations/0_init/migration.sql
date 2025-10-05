-- CreateTable
CREATE TABLE "sentences" (
    "sentence_id" SERIAL NOT NULL,
    "english_sentence" VARCHAR(500) NOT NULL,
    "difficulty_level" INTEGER NOT NULL,
    "source" VARCHAR(100) NOT NULL,
    "korean_sentence" VARCHAR(500),

    CONSTRAINT "sentences_pkey" PRIMARY KEY ("sentence_id")
);

