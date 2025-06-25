export function handlerReadiness(req, res) {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.set("Cache-Control", "no-store");
    res.send("OK");
    res.end;
}
