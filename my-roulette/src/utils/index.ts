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
  // 총 시간
  const accelerationConstant = Math.log(1 / initialSpeed) / totalTime; // 로그 함수에 기반한 감속 상수

  // 현재 시간에 따른 속도 계산
  const currentSpeed =
    initialSpeed * Math.exp(accelerationConstant * timeElapsed);

  return currentSpeed;
}
