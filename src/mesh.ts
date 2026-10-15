/**
 * Hero background: a drifting Bluetooth-mesh style network. Messages are
 * relayed with managed flooding — each node forwards a message id once,
 * with a TTL — just like the BLE Mesh thesis project.
 */

interface MeshNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  glow: number;
  seen: Set<number>;
}

interface Packet {
  from: MeshNode;
  to: MeshNode;
  t: number;
  msg: number;
  ttl: number;
}

const LINK = 150;
const SPEED = 0.0028; // fraction of an edge per ms

export function startMesh(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0;
  let h = 0;
  let nodes: MeshNode[] = [];
  let packets: Packet[] = [];
  let msgId = 0;
  let raf = 0;
  let last = performance.now();
  let nextBroadcast = 600;
  let visible = true;
  const mouse = { x: -9999, y: -9999 };

  const css = getComputedStyle(document.documentElement);
  const cyan = css.getPropertyValue('--cyan-rgb').trim() || '62,224,255';
  const amber = css.getPropertyValue('--amber-rgb').trim() || '255,182,39';

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(28, Math.min(90, Math.round((w * h) / 15000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.018,
      vy: (Math.random() - 0.5) * 0.018,
      r: 1.4 + Math.random() * 1.8,
      glow: 0,
      seen: new Set<number>(),
    }));
    packets = [];
  }

  function neighbours(n: MeshNode) {
    return nodes.filter((m) => m !== n && Math.hypot(m.x - n.x, m.y - n.y) < LINK);
  }

  function broadcast(src: MeshNode) {
    const msg = ++msgId;
    src.seen.add(msg);
    src.glow = 1;
    for (const m of neighbours(src)) packets.push({ from: src, to: m, t: 0, msg, ttl: 7 });
  }

  function nearest(x: number, y: number) {
    let best = nodes[0];
    let d = Infinity;
    for (const n of nodes) {
      const dd = (n.x - x) ** 2 + (n.y - y) ** 2;
      if (dd < d) {
        d = dd;
        best = n;
      }
    }
    return best;
  }

  function step(dt: number) {
    for (const n of nodes) {
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      // gentle pull towards the cursor
      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const d = Math.hypot(dx, dy);
      if (d < 180 && d > 1) {
        n.x += (dx / d) * 0.012 * dt;
        n.y += (dy / d) * 0.012 * dt;
      }
      n.glow = Math.max(0, n.glow - dt * 0.0016);
    }

    const arrived: Packet[] = [];
    packets = packets.filter((p) => {
      p.t += SPEED * dt;
      if (p.t >= 1) {
        arrived.push(p);
        return false;
      }
      return true;
    });
    for (const p of arrived) {
      const n = p.to;
      if (n.seen.has(p.msg)) continue; // message cache: relay once
      n.seen.add(p.msg);
      n.glow = 1;
      if (p.ttl <= 1) continue;
      for (const m of neighbours(n)) {
        if (m !== p.from && !m.seen.has(p.msg)) packets.push({ from: n, to: m, t: 0, msg: p.msg, ttl: p.ttl - 1 });
      }
    }
    if (packets.length > 400) packets.splice(0, packets.length - 400);

    nextBroadcast -= dt;
    if (nextBroadcast <= 0) {
      broadcast(nodes[(Math.random() * nodes.length) | 0]);
      nextBroadcast = 2600 + Math.random() * 2200;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          const alpha = (1 - d / LINK) * 0.22 + Math.max(a.glow, b.glow) * 0.18;
          ctx.strokeStyle = `rgba(${cyan},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (md < 180) {
        ctx.strokeStyle = `rgba(${amber},${(1 - md / 180) * 0.35})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    for (const n of nodes) {
      if (n.glow > 0) {
        ctx.fillStyle = `rgba(${amber},${n.glow * 0.18})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 14 * n.glow, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = n.glow > 0.05 ? `rgba(${amber},${0.6 + n.glow * 0.4})` : `rgba(${cyan},0.75)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const p of packets) {
      const x = p.from.x + (p.to.x - p.from.x) * p.t;
      const y = p.from.y + (p.to.y - p.from.y) * p.t;
      ctx.fillStyle = `rgba(${amber},0.95)`;
      ctx.shadowColor = `rgba(${amber},0.9)`;
      ctx.shadowBlur = 8;
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }
    ctx.shadowBlur = 0;
  }

  function loop(now: number) {
    const dt = Math.min(48, now - last);
    last = now;
    if (visible) {
      step(dt);
      draw();
    }
    raf = requestAnimationFrame(loop);
  }

  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  };
  const onLeave = () => {
    mouse.x = mouse.y = -9999;
  };
  const onClick = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    broadcast(nearest(e.clientX - r.left, e.clientY - r.top));
  };

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  io.observe(canvas);
  const host = canvas.parentElement!;
  host.addEventListener('pointermove', onMove);
  host.addEventListener('pointerleave', onLeave);
  host.addEventListener('click', onClick);

  if (reduced) {
    draw();
  } else {
    raf = requestAnimationFrame(loop);
  }

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerleave', onLeave);
    host.removeEventListener('click', onClick);
  };
}
