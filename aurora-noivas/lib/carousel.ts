export function nextSlide(current: number, direction: number, count: number) { return count > 0 ? ((current + direction) % count + count) % count : 0; }
