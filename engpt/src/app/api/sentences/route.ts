import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const filter = searchParams.get("filter") || "all"; // all | translated | untranslated

    const skip = (page - 1) * limit;

    // 필터 조건
    const where =
      filter === "translated"
        ? { korean_sentence: { not: null } }
        : filter === "untranslated"
        ? { korean_sentence: null }
        : {};

    // 총 개수 조회
    const totalCount = await prisma.sentences.count({ where });

    // 문장 조회
    const sentences = await prisma.sentences.findMany({
      where,
      skip,
      take: limit,
      orderBy: { sentence_id: "asc" },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      sentences,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Sentences fetch error:", error);
    return NextResponse.json({ error: "문장 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
