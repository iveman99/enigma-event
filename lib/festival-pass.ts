export interface FestivalEvent { id: string; title: string; team: string }
export interface FestivalPass {
  email: string;
  name: string;
  phone: string;
  token: string;
  checkedInAt: string | null;
  events: FestivalEvent[];
  isMine: boolean;
}

export function passCode(token: string) { return `ENG27:${token}`; }
export function parsePassCode(value: string) {
  const match = value.trim().match(/^(?:ENG27:)?([a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/i);
  return match?.[1].toLowerCase() || null;
}
