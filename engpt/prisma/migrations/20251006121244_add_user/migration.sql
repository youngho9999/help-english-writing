-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentences" (
    "sentence_id" SERIAL NOT NULL,
    "english_sentence" VARCHAR(500) NOT NULL,
    "difficulty_level" INTEGER NOT NULL,
    "source" VARCHAR(100) NOT NULL,
    "korean_sentence" VARCHAR(500),

    CONSTRAINT "sentences_pkey" PRIMARY KEY ("sentence_id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sentenceId" INTEGER NOT NULL,
    "userAnswer" VARCHAR(1000) NOT NULL,
    "korean" VARCHAR(500) NOT NULL,
    "score" INTEGER NOT NULL,
    "correctedSentence" VARCHAR(1000) NOT NULL,
    "feedbackSummary" TEXT NOT NULL,
    "detailedFeedback" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "submissions_userId_idx" ON "submissions"("userId");

-- CreateIndex
CREATE INDEX "submissions_sentenceId_idx" ON "submissions"("sentenceId");

-- CreateIndex
CREATE INDEX "submissions_createdAt_idx" ON "submissions"("createdAt");

-- CreateIndex
CREATE INDEX "submissions_sentenceId_userAnswer_idx" ON "submissions"("sentenceId", "userAnswer");

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_sentenceId_fkey" FOREIGN KEY ("sentenceId") REFERENCES "sentences"("sentence_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
