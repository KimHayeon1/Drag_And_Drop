[배포 URL](https://dragdrop-kimhayeon.netlify.app/)

## Webpack
create-react-app의 react-scripts 대신 직접 Webpack 설정하여 React 애플리케이션을 구성했다.

## 드래그 제약 조건
- 첫 번째 칼럼에서 세 번째 칼럼으로는 아이템 이동이 불가능하다.
- 짝수 아이템은 다른 짝수 아이템 앞으로 이동할 수 없다.

## 드래그 & 드롭 가이드
### 1. 마우스
- 다중 선택 : shift + 클릭(마우스 왼쪽)
- 추가 선택 : ctrl/command + 클릭(마우스 왼쪽)
- 단일 선택 : 클릭(마우스 왼쪽)

### 2. 키보드
- 다중 선택 : shift + 화살표 위/아래
- 단일 선택 : tab, shift + tab, 화살표 위/아래
- dragStart : 스페이스 바
- dragUpdate : 화살표
- dragEnd : 스페이스 바

### 3. 전체 선택 취소
- 아이템 외 포커스 (클릭, tab, shift + tab)

<br>

## 멀티 드래그 구현 (마우스)
### 1. 단일 선택
- 선택한 그룹이 있는 경우 : 아이템 선택
- 선택한 그룹이 없는 경우 : 아이템 토글

### 2. 다중 선택
#### 2-1. 기존에 선택한 아이템이 없는 경우
아이템 선택

#### 2-2. 기존에 선택한 아이템이 있는 경우
- 멀티 셀렉트 시작 아이템의 칼럼 != 선택한 아이템 칼럼
현상 유지

- 멀티 셀렉트 시작 아이템의 칼럼 = 선택한 아이템 칼럼
  - A. 새로운 멀티 셀렉트 그룹
    - 선택한 아이템 인덱스 > 멀티 셀렉트 시작 아이템 인덱스 : (멀티 셀렉트 시작 아이템 ~ 선택한 아이템) 선택
    - 선택한 아이템 인덱스 < 멀티 셀렉트 시작 아이템 인덱스 : (선택한 아이템 ~ 멀티 셀렉트 시작 아이템) 선택
    - 선택한 아이템 인덱스 = 멀티 셀렉트 시작 아이템 인덱스 : 현상 유지
  - B. 기존에 선택된 아이템 중 A와 연속되지 않은 아이템
  - A + B = 최종 선택된 아이템 리스트

### 3. 추가 선택
- 셀렉트 그룹에 선택한 아이템 추가

### 4. 드래그 이벤트 발생 시
- 조건
  - 드래그 시, 클릭 이벤트는 발생하지 않는다.
  - ctrl/shift 누를 때 드래그 이벤트는 발생하지 않는다.
- 구현
  - 셀렉트 그룹에 드래그한 아이템이 없을 경우 : 아이템 추가 선택
  - 단일 선택한 아이템 != 드래그한 아이템 : 드래그한 아이템 선택

<br>

https://github.com/KimHayeon1/secret/assets/108985221/4ee14b1c-4516-4619-9d26-1360a97232e3

<br>

## 멀티 드래그 구현 (키보드)
화살표 keydown 이벤트는 아이템에 등록

### 1. 단일 선택
- tab, shift + tab : 포커스된 아이템 단일 선택
- 화살표 위
  - 첫번째 아이템에서 keydown : 마지막 아이템 선택
  - 이전 아이템이 있을 경우 : 이전 아이템 선택
- 화살표 아래
  - 마지막 아이템에서 keydown : 첫번째 아이템 선택
  - 다음 아이템이 있을 경우 : 다음 아이템 선택

### 2. 다중 선택
- 화살표 위
  - 이전 아이템이 선택되어 있을 경우 : 이벤트가 발생한 아이템 선택 해제
  - 이전 아이템이 선택되어 있지 않을 경우 : 이전 아이템 선택
- 화살표 아래 
  - 다음 아이템이 선택되어 있을 경우 : 이벤트가 발생한 아이템 선택 해제
  - 다음 아이템이 선택되어 있지 않을 경우 : 다음 아이템 선택
  
https://github.com/KimHayeon1/secret/assets/108985221/da3b52da-06c8-471c-9a43-47389799b4ba
