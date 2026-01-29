package tasks

type Status string

const (
	Pending Status = "PENDING"
	Done    Status = "DONE"
)

type Priority string

const (
	Low    Priority = "LOW"
	Medium Priority = "MEDIUM"
	High   Priority = "HIGH"
)

func (s Status) IsValid() bool {
	switch s {
	case Pending, Done:
		return true
	default:
		return false
	}
}

func (p Priority) IsValid() bool {
	switch p {
	case Low, Medium, High:
		return true
	default:
		return false
	}
}
