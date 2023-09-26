const Palette = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div className="rounded bg-background border p-2 px-4 ">
          <p className="text-foreground">foreground</p>
        </div>
        <div className="rounded bg-foreground p-2 px-4 border">
          <p className="text-background">background</p>
        </div>
        <div className="rounded bg-primary p-2 px-4">
          <p className="text-primary-foreground">primary</p>
        </div>
        <div className="rounded bg-secondary p-2 px-4">
          <p className="text-secondary-foreground">secondary</p>
        </div>
        <div className="rounded bg-muted p-2 px-4">
          <p className="text-muted-foreground">muted</p>
        </div>
        <div className="rounded bg-accent p-2 px-4">
          <p className="text-accent-foreground">accent</p>
        </div>
        <div className="rounded bg-destructive p-2 px-4">
          <p className="text-destructive-foreground">destructive</p>
        </div>
        <div className="rounded bg-card p-2 px-4 shadow-lg">
          <p className="text-card-foreground">card</p>
        </div>
      </div>
    </>
  );
};

export default Palette;
