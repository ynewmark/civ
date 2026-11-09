export function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function pickOne<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

export function pickN<T>(items: T[], n: number): T[] {
    const result: T[] = [];
    for (let i = 0; i < n; i++) {
        result.push(pickOne(items));
    }
    return result;
}

export function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
