---
layout: default
title: Project 2
---

# Project 2

## Fun with Filters and Frequencies

### Fun with Filters

What is a filter? Google says:

> A filter is a device, material, or program that removes unwanted parts or elements from a substance, signal, or data set while letting the desired parts pass through

In this project I remove some "unwanted parts" from images. A natural question is, "what can we easily *remove* from an image?" You could, of course, crop out some parts of the image and call *that* a filter. It is, but it is a *boring one*.

The goal in this part is to extract the *edges* from an image. In order to do this, we must discuss something called "convolution," a word which derives not from "convolute" but "convolve." I think of convolution as a sort of spatial "mixing" of the original image according to some rule. Consider the following rule: the pixel in position $(x, y)$ in the new image comes from position $(x-1, y)$ in the old image. We can conveniently describe this modification with a filter:

$$
\begin{bmatrix}
\color{blue}{0} & 0 & 0 \\
\color{green}{1} & \color{red}{0} & 0 \\
0 & 0 & 0
\end{bmatrix}
$$

A filter essentially "stamps" several scaled and shifted copies of the original image, and then adds them all up. In this case, the result is a single copy of the original image shifted leftward by $1$ pixel, since the only non-zero entry (in green) stamps out a copy shifted leftward relative to the filter's center. To further develop your understanding, consider the following tweaks:

- If the green entry was $\neq 1$, the stamped copy would also scale the pixel intensities. If it were, say, $0.5$, we would get a left-shifted and *dimmed* copy of the original image.
- If instead the entry in red was $1$, and the other entries were $0$, the filter would do *nothing*.  
- If both the red and green entries were $1$, we would get the sum of the original image and a left-shifted copy. This would effectively "blur" the image in the horizontal direction.
- What would be the effect of setting only the *blue* pixel to be non-zero?

Consider now the "box filter" below:

$$
\begin{bmatrix}
\frac{1}{9} & \frac{1}{9} & \frac{1}{9} \\
\frac{1}{9} & \frac{1}{9} & \frac{1}{9} \\
\frac{1}{9} & \frac{1}{9} & \frac{1}{9}
\end{bmatrix}
$$

This will add *nine* copies of the original image, each shifted by 1 pixel in a different direction and scaled to be $1 / 9$ as bright. I interpret this filter as something which "spreads out" the energy formerly concentrated in just one pixel. Suppose the original image had a single bright pixel at $(x, y)$; the filter spreads this energy to all its neighbors, so that the resulting image has $9$ dimmer pixels instead. Thus, this filter[^1] results in a blur:

![Copies of the cameraman scaled by a box filter and added up; then full, same, and valid crops]({{ '/cs180/2/images/box_filter_stamps.gif' | relative_url }})

Note that we had to deal with some edge cases, in our dealing with the edges. Hence we define three 'modes' of discrete convolution:

- **full** keeps all of the stamped entries, even those which contain information from only one copy.
- **same** truncates *some* entries so that the result keeps the original image's dimensions.
- **valid** keeps only the entries that are made from *all* of the stamped copies.

That's a visual and intuitive explanation of convolution. I hope it was not too convoluted! It turns out there there is a [mathemical equation]([https://en.wikipedia.org/wiki/Convolution](https://en.wikipedia.org/wiki/Convolution)) to model the adding-up of scaled and shifted copies of an image according to a filter. Here is some code that computes this, in case you are grading me:

```python
def homemade_conv2D(s, f, mode):
    # ---- original dimensions ----
    h_s, w_s = s.shape
    h_f, w_f = f.shape

    # ---- padding ----
    s_padded = zero_pad(s, f, mode)

    # ---- determine result size ----
    res = get_empty_res(s, f, mode)
    h_r, w_r = res.shape
```

The details of zero padding and the size of the empty result image are determined by our choice of 'mode' according to the edge cases explained above. For example, in the **valid** case, the image is not zero padded so that we only add up entries which exist in the original matrix, and the empty result matrix is made to be smaller than the original image.

The code below computes each filtered pixel one-by-one, by scaling and adding source pixels according to the filter.

```python
# ---- flip-and-drag style convolution ----
ff = np.flip(f)
for n in range(h_r):
    for m in range(w_r):
        px = 0.0
        for u in range(h_f):
            for v in range(w_f):
                value = s_padded[n+u, m+v]
                weight = ff[u, v]
                px += value * weight
        res[n, m] = px
```

The code below - which I call "cookie-cutter" style because it slices out the region of the original image which contributes to each filtered pixel, like a cookie-mold does to a sheet of dough - does the same thing, but faster. This is because `numpy` operations are "vectorized," i.e., faster than python `for` loops. In fact, you could do better still with `scipy.signal.convolve2d`, which calls highly optimized C code to compute a convolution.

```python
# ---- cookie-cutter style convolution ----
ff = np.flip(f)
for n in range(h_r):
    for m in range(w_r):
        patch = s_padded[n:n+h_f, m:m+w_f]
        res[n, m] = np.sum(patch * ff)
```

Here are the results of some convolutions computed with the following filters:

- box blur - $9 \times 9$, weighted analagous to that used in the animation above. it turns out that this filter causes some artifacts (called [gibbs ringing](https://en.wikipedia.org/wiki/Ringing_artifacts)) because of the sharp 'drop' from $1 / 81$ to $0$ at the edges of the filter.
- gaussian blur - $9 \times 9$, weighted so as to resemble a gaussian. this reduces the ringing artifacts seen with a basic box blur.
- dx - $1 \times 3$, weighted so that horizontal edges are accentuated.
- dy - $3 \times 1$, weighted so that vertical edges are accentuated.

<figure class="carousel" data-carousel tabindex="0" aria-roledescription="carousel" aria-label="Basic filter results on a self portrait">
  <div class="carousel-viewport">
    <ul class="carousel-track">
      <li class="carousel-slide">
        <img src="{{ '/cs180/2/images/none_self.jpg' | relative_url }}" alt="Original self portrait, unfiltered">
        <p class="carousel-caption">original</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/2/images/boxblur_self.jpg' | relative_url }}" alt="Self portrait after a box blur">
        <p class="carousel-caption">box blur</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/2/images/gaussian_blur_self.jpg' | relative_url }}" alt="Self portrait after a gaussian blur">
        <p class="carousel-caption">gaussian blur</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/2/images/dx_self.jpg' | relative_url }}" alt="Self portrait after a horizontal derivative filter">
        <p class="carousel-caption">dx</p>
      </li>
      <li class="carousel-slide">
        <img src="{{ '/cs180/2/images/dy_self.jpg' | relative_url }}" alt="Self portrait after a vertical derivative filter">
        <p class="carousel-caption">dy</p>
      </li>
    </ul>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-btn" data-carousel-prev aria-label="Previous slide">Prev</button>
    <div class="carousel-dots" role="tablist" aria-label="Slides">
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show original" aria-current="true"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show box blur"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show gaussian blur"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show dx"></button>
      <button type="button" class="carousel-dot" data-carousel-dot aria-label="Show dy"></button>
    </div>
    <button type="button" class="carousel-btn" data-carousel-next aria-label="Next slide">Next</button>
  </div>
</figure>

Notice that the dx and dy filters show edges in only one direction; we can emphasize edges in all directions by computing the gradient $\text{dx}^2 + \text{dy}^2$.

<div class="grad-eq" role="img" aria-label="dx squared plus dy squared yields the gradient">
  <figure class="has-sq">
    <img src="{{ '/cs180/2/images/dx_cameraman.jpg' | relative_url }}" alt="Horizontal derivative of the cameraman">
    <span class="sq" aria-hidden="true">2</span>
    <figcaption>dx</figcaption>
  </figure>
  <span class="op" aria-hidden="true">+</span>
  <figure class="has-sq">
    <img src="{{ '/cs180/2/images/dy_cameraman.jpg' | relative_url }}" alt="Vertical derivative of the cameraman">
    <span class="sq" aria-hidden="true">2</span>
    <figcaption>dy</figcaption>
  </figure>
  <span class="op" aria-hidden="true">→</span>
  <figure>
    <img src="{{ '/cs180/2/images/grad_cameraman.jpg' | relative_url }}" alt="Gradient magnitude of the cameraman">
    <figcaption>gradient</figcaption>
  </figure>
</div>

The gradient picks up quick changes in small "noisy" details, which isn't really what we want with an edge detector. Check out the background and foreground - textured parts of the scene, like grass, show up in this gradient. We can fix this by thresholding, i.e., setting all image values below a certain value to $0$:

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/grad_t10_cameraman.jpg' | relative_url }}" alt="Cameraman gradient thresholded at 10 percent">
    <figcaption>10%</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/grad_t20_cameraman.jpg' | relative_url }}" alt="Cameraman gradient thresholded at 20 percent">
    <figcaption>20%</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/grad_t50_cameraman.jpg' | relative_url }}" alt="Cameraman gradient thresholded at 50 percent">
    <figcaption>50%</figcaption>
  </figure>
</div>

I think the $20\%$ threshold looks best, because it removes most of the noisy details but retains edges. Notice that the $50\%$ threshold is too high, harming the edges' visual quality.

Here is another way to remove the "noisy" details: a blur averages each pixels with its neighbors, which smooths out rough textures like that in the grass. For example, see the selfies above, where the gaussian blur removed sharp edges between buildings in the background. A clever trick is to incorporate a blur into our edge detector. The animation below explains the strategy.[^2]

![Animation of DOG edge detection]({{ '/cs180/2/images/convolution_modes.gif' | relative_url }})

It turns out that convolution is *associative*. In english, the derivative of a blurred image is equivalent to the blurred derivative of an image. These blurred derivatives are called "derivative of gaussian" (DOG) filters. You compute it by convolving a derivative with a gaussian.

<div class="grad-eq kernels" role="img" aria-label="dx convolved with a 21 by 21 gaussian yields a derivative of gaussian">
  <figure>
    <img src="{{ '/cs180/2/images/dx_filter.png' | relative_url }}" alt="Horizontal derivative filter">
    <figcaption>dx</figcaption>
  </figure>
  <span class="op" aria-hidden="true">∗</span>
  <figure>
    <img src="{{ '/cs180/2/images/gaussian_21.png' | relative_url }}" alt="21 by 21 gaussian blur filter">
    <figcaption>gaussian</figcaption>
  </figure>
  <span class="op" aria-hidden="true">→</span>
  <figure>
    <img src="{{ '/cs180/2/images/dog_dx_21.png' | relative_url }}" alt="Horizontal derivative of gaussian filter, size 21">
    <figcaption>DOG</figcaption>
  </figure>
</div>

<div class="grad-eq kernels" role="img" aria-label="dy convolved with a 21 by 21 gaussian yields a derivative of gaussian">
  <figure>
    <img src="{{ '/cs180/2/images/dy_filter.png' | relative_url }}" alt="Vertical derivative filter">
    <figcaption>dy</figcaption>
  </figure>
  <span class="op" aria-hidden="true">∗</span>
  <figure>
    <img src="{{ '/cs180/2/images/gaussian_21.png' | relative_url }}" alt="21 by 21 gaussian blur filter">
    <figcaption>gaussian</figcaption>
  </figure>
  <span class="op" aria-hidden="true">→</span>
  <figure>
    <img src="{{ '/cs180/2/images/dog_dy_21.png' | relative_url }}" alt="Vertical derivative of gaussian filter, size 21">
    <figcaption>DOG</figcaption>
  </figure>
</div>

Here are some results of applying a DOG[^3] and then thresholding:

<div class="image-row long-cap">
  <figure>
    <img src="{{ '/cs180/2/images/dog_t40_7_cameraman.jpg' | relative_url }}" alt="Cameraman edges from a 7 by 7 derivative of gaussian, thresholded at 40 percent">
    <figcaption>7×7 blur kernel · 40% threshold</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/dog_t30_21_cameraman.jpg' | relative_url }}" alt="Cameraman edges from a 21 by 21 derivative of gaussian, thresholded at 30 percent">
    <figcaption>21×21 blur kernel · 30% threshold</figcaption>
  </figure>
</div>

Applying more blur indeed removes more of the "undesired" background edges. However, the mild blur looks better to me because the edges are sharper.

There is actually another strategy for edge detection, called the [Laplacian](https://en.wikipedia.org/wiki/Laplace_operator), which basically tells us how much each point differs the local average. You can approximate it with a $2\text{D}$ filter:

<div class="grad-eq kernels long" role="img" aria-label="dx convolved with dx plus dy convolved with dy equals a laplacian">
  <figure>
    <img src="{{ '/cs180/2/images/dx_fwd.png' | relative_url }}" alt="Horizontal forward difference filter">
    <figcaption>dx</figcaption>
  </figure>
  <span class="op" aria-hidden="true">∗</span>
  <figure>
    <img src="{{ '/cs180/2/images/dx_fwd.png' | relative_url }}" alt="Horizontal forward difference filter">
    <figcaption>dx</figcaption>
  </figure>
  <span class="op" aria-hidden="true">+</span>
  <figure>
    <img src="{{ '/cs180/2/images/dy_fwd.png' | relative_url }}" alt="Vertical forward difference filter">
    <figcaption>dy</figcaption>
  </figure>
  <span class="op" aria-hidden="true">∗</span>
  <figure>
    <img src="{{ '/cs180/2/images/dy_fwd.png' | relative_url }}" alt="Vertical forward difference filter">
    <figcaption>dy</figcaption>
  </figure>
  <span class="op" aria-hidden="true">=</span>
  <figure>
    <img src="{{ '/cs180/2/images/laplacian_filter.png' | relative_url }}" alt="Laplacian filter from forward differences">
    <figcaption>laplacian</figcaption>
  </figure>
</div>

<div class="image-row">
  <figure>
    <img src="{{ '/cs180/2/images/laplace_cameraman.jpg' | relative_url }}" alt="Cameraman after a basic laplacian filter">
    <figcaption>laplacian</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/laplace_t10_cameraman.jpg' | relative_url }}" alt="Cameraman laplacian thresholded at 10 percent">
    <figcaption>10% threshold</figcaption>
  </figure>
</div>

The results aren't quite as good as the gradient because pixels in noisy areas, i.e. grass, tend to be very different from the *local average*. This means that the Laplacian likes *peaks* or *troughs* in pixel brightness. This is not exactly what we want from an edge detector; rather, we want sharp change in a direction.

Applying a blur is therefore *more important* for the laplacian; a blur effectively averages pixels which removes exactly the type of non-edge "noise" we don't want to see. Check out the results of applying a blurred Laplacian, like that pictured below, and then thresholding.

<div class="grad-eq kernels" role="img" aria-label="laplacian convolved with a 21 by 21 gaussian yields a blurred laplacian">
  <figure>
    <img src="{{ '/cs180/2/images/laplacian_filter.png' | relative_url }}" alt="Laplacian filter">
    <figcaption>laplacian</figcaption>
  </figure>
  <span class="op" aria-hidden="true">∗</span>
  <figure>
    <img src="{{ '/cs180/2/images/gaussian_21.png' | relative_url }}" alt="21 by 21 gaussian blur filter">
    <figcaption>gaussian</figcaption>
  </figure>
  <span class="op" aria-hidden="true">→</span>
  <figure>
    <img src="{{ '/cs180/2/images/laplacian_b_21.png' | relative_url }}" alt="Blurred laplacian filter, size 21">
    <figcaption>blurred</figcaption>
  </figure>
</div>

<div class="image-row long-cap">
  <figure>
    <img src="{{ '/cs180/2/images/laplace_t30_7_cameraman.jpg' | relative_url }}" alt="Cameraman laplacian from a 7 by 7 blur, thresholded at 30 percent">
    <figcaption>7×7 blur kernel · 30% threshold</figcaption>
  </figure>
  <figure>
    <img src="{{ '/cs180/2/images/laplace_t30_21_cameraman.jpg' | relative_url }}" alt="Cameraman laplacian from a 21 by 21 blur, thresholded at 30 percent">
    <figcaption>21×21 blur kernel · 30% threshold</figcaption>
  </figure>
</div>

# Fun with Frequencies

[^1]: The GIF actually uses a $27 \times 27$ filter, chunked into $3 \times 3$ "pixels." That is, each addition is actually the addition of all 9 copies coming from a $3 \times 3$ chunk. This exaggerates the effect of an analogous $3 \times 3$ box filter, for the sake of visualization.

[^2]: I made the animation with pixel _value_ cutoffs, but later decided it would be more useful to define a threshold based on the percent of the maximum pixel value.

[^3]: Since convolution is also _commutative_, you'd get the same results regardless of the order in which the blur and the derivative are applied. There are are some tricks you have to play with these discrete and finite support image signals, however, regarding the convolution mode so that they match exactly.