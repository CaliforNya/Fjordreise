type ExampleButton = {
  label: string;
};

export function ExampleButton({ label }: ExampleButton) {
  return <button>{label}</button>;
}
