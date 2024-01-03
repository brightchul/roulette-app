export const mathLog = Math.log;
export const mathExp = Math.exp;
export const mathSin = Math.sin;
export const mathCos = Math.cos;
export const random = Math.random;
export const min = Math.min;

export function degreeToRadian(degree: number) {
  return (degree * Math.PI) / 180;
}

export function getRandomTime(baseTime: number, interval: number) {
  return baseTime + random() * interval;
}

export function sum(...values: unknown[]) {
  let result = 0;
  for (let index = 0; index < values.length; index++) {
    const value = parseInt(`${values[index]}`, 10);
    if (isNaN(value)) continue;
    result += value;
  }
  return result;
}

export function decelerateSpeed(
  initialSpeed: number,
  timeElapsed: number,
  totalTime: number
) {
  const deceleration = mathLog(1 / initialSpeed) / totalTime;
  const currentSpeed = initialSpeed * mathExp(deceleration * timeElapsed);

  return currentSpeed;
}
