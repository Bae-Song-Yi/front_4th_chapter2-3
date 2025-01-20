import React from "react"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui"

interface PostManagerPagenationProps {
  total: number
  skip: number
  limit: number
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
}

const PostManagerPagenation = ({ total, skip, limit, setSkip, setLimit }: PostManagerPagenationProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="항목 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
          다음
        </Button>
      </div>
    </div>
  )
}

export default PostManagerPagenation
