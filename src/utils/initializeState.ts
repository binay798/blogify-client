export default function initializeState(props: any[]): void {
  props.forEach((el) => {
    el('');
  });
}
