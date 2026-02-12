package leetcode

type Pattern string

const (
	PatternSlidingWindow    Pattern = "Sliding Window"
	PatternTwoPointers      Pattern = "Two Pointers"
	PatternFastSlowPointers Pattern = "Fast & Slow Pointers"
	PatternMergeIntervals   Pattern = "Merge Intervals"
	PatternCyclicSort       Pattern = "Cyclic Sort"
	PatternInPlaceReversal  Pattern = "In-place Reversal"
	PatternBFS              Pattern = "BFS"
	PatternDFS              Pattern = "DFS"
	PatternTwoHeaps         Pattern = "Two Heaps"
	PatternSubsets          Pattern = "Subsets"
	PatternBinarySearch     Pattern = "Binary Search"
	PatternTopKElements     Pattern = "Top K Elements"
	PatternKWayMerge        Pattern = "K-way Merge"
	PatternBacktracking     Pattern = "Backtracking"
	PatternDP               Pattern = "Dynamic Programming"
	PatternGreedy           Pattern = "Greedy"
	PatternGraphs           Pattern = "Graphs"
	PatternTrie             Pattern = "Trie"
	PatternTopologicalSort  Pattern = "Topological Sort"
	PatternUnionFind        Pattern = "Union Find"
	PatternMonotonicStack   Pattern = "Monotonic Stack"
	PatternBitManipulation  Pattern = "Bit Manipulation"
)

func (p Pattern) IsValid() bool {
	switch p {
	case PatternSlidingWindow, PatternTwoPointers, PatternFastSlowPointers,
		PatternMergeIntervals, PatternCyclicSort, PatternInPlaceReversal,
		PatternBFS, PatternDFS, PatternTwoHeaps, PatternSubsets,
		PatternBinarySearch, PatternTopKElements, PatternKWayMerge,
		PatternBacktracking, PatternDP, PatternGreedy, PatternGraphs,
		PatternTrie, PatternTopologicalSort, PatternUnionFind,
		PatternMonotonicStack, PatternBitManipulation:
		return true
	}
	return false
}

type Difficulty string

const (
	DifficultyEasy   Difficulty = "Easy"
	DifficultyMedium Difficulty = "Medium"
	DifficultyHard   Difficulty = "Hard"
)

func (d Difficulty) IsValid() bool {
	switch d {
	case DifficultyEasy, DifficultyMedium, DifficultyHard:
		return true
	}
	return false
}
