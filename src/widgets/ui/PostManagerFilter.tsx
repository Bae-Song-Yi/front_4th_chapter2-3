import React, { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui"

interface FilterProps {
  onSearch: (query: string) => void
  onTagSelect: (tag: string) => void
  onSortChange: (sortBy: string, sortOrder: string) => void
}

const PostManagerFilter = ({ onSearch, onTagSelect, onSortChange }: FilterProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 상태 관리
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "")
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc")
  const [tags, setTags] = useState<Array<{ url: string; slug: string }>>([])
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "")

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  // 검색 처리
  const handleSearch = () => {
    onSearch(searchQuery)
    updateURL()
  }

  // 정렬 변경 처리
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    onSortChange(newSortBy, sortOrder)
    updateURL()
  }

  // 정렬 순서 변경 처리
  const handleSortOrderChange = (newSortOrder: string) => {
    setSortOrder(newSortOrder)
    onSortChange(sortBy, newSortOrder)
    updateURL()
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      <Select
        value={selectedTag}
        onValueChange={(value) => {
          setSelectedTag(value)
          onTagSelect(value)
          updateURL()
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={handleSortOrderChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default PostManagerFilter
