import sys

sys.stdout.reconfigure(encoding='utf-8')

f = open('src/components/FooterBackground.tsx', 'rb')
c = f.read().decode('utf-8')
f.close()

BOTTOM = 518

# ── Mountains: reduce height by 20% (newY = BOTTOM - (BOTTOM - oldY) * 0.8) ──

# Back mountain range
c = c.replace(
    'd="M0,347 Q75,308 150,273 Q225,322 300,245 Q375,273 450,207 Q525,238 600,175 Q675,217 750,196 Q825,259 900,235 Q975,294 1050,269 Q1125,322 1200,343 L1200,518 L0,518 Z"',
    'd="M0,381 Q75,350 150,322 Q225,361 300,300 Q375,322 450,269 Q525,294 600,244 Q675,277 750,260 Q825,311 900,292 Q975,339 1050,319 Q1125,361 1200,378 L1200,518 L0,518 Z"'
)

# Valley surface
c = c.replace(
    'd="M0,353 Q150,325 300,287 Q450,269 600,241 Q750,263 900,277 Q1050,311 1200,350 L1200,518 L0,518 Z"',
    'd="M0,386 Q150,364 300,333 Q450,319 600,296 Q750,314 900,325 Q1050,352 1200,384 L1200,518 L0,518 Z"'
)

# Front mountain range
c = c.replace(
    'd="M0,357 Q100,336 200,301 Q275,343 350,273 Q425,308 500,235 Q550,259 600,213 Q650,245 700,221 Q800,280 900,259 Q975,315 1050,294 Q1100,336 1200,353 L1200,518 L0,518 Z"',
    'd="M0,389 Q100,372 200,344 Q275,378 350,322 Q425,350 500,292 Q550,311 600,274 Q650,300 700,280 Q800,328 900,311 Q975,356 1050,339 Q1100,372 1200,386 L1200,518 L0,518 Z"'
)

# ── Waves: reduce max height by 50% (newY = BOTTOM - (BOTTOM - oldY) * 0.5) ──

# Wave 1
c = c.replace(
    'd="M-100,445 Q600,277 1300,445 L1300,518 L-100,518 Z"',
    'd="M-100,482 Q600,398 1300,482 L1300,518 L-100,518 Z"'
)

# Wave 2
c = c.replace(
    'd="M-100,462 Q600,294 1300,462 L1300,518 L-100,518 Z"',
    'd="M-100,490 Q600,406 1300,490 L1300,518 L-100,518 Z"'
)

# Wave 3
c = c.replace(
    'd="M-100,473 Q600,305 1300,473 L1300,518 L-100,518 Z"',
    'd="M-100,496 Q600,412 1300,496 L1300,518 L-100,518 Z"'
)

# Wave gradients: scale range by 50% to match wave height reduction
c = c.replace('y1="266"', 'y1="392"')  # 518-(518-266)*0.5 = 392
c = c.replace('y1="280"', 'y1="399"')  # 518-(518-280)*0.5 = 399
c = c.replace('y1="294"', 'y1="406"')  # 518-(518-294)*0.5 = 406

f = open('src/components/FooterBackground.tsx', 'wb')
f.write(c.encode('utf-8'))
f.close()

# Verify
assert 'M0,381 Q75,350' in c, "Back mountains not updated"
assert 'M0,386 Q150,364' in c, "Valley not updated"
assert 'M0,389 Q100,372' in c, "Front mountains not updated"
assert 'M-100,482 Q600,398' in c, "Wave 1 not updated"
assert 'M-100,490 Q600,406' in c, "Wave 2 not updated"
assert 'M-100,496 Q600,412' in c, "Wave 3 not updated"
assert 'y1="392"' in c, "Gradient wg1 not updated"
assert 'y1="399"' in c, "Gradient wg2 not updated"
assert 'y1="406"' in c, "Gradient wg3 not updated"
print("SUCCESS:")
print("  Mountains: height reduced 20% (peaks ~20% closer to bottom)")
print("  Waves: max height reduced 50% (movement proportions preserved)")
print("  Wave gradients: ranges scaled to match new wave heights")
