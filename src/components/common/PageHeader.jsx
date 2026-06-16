import BlurFade from "../motion/BlurFade";
import { BlurText } from "../reactbits";

function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        {title ? (
          <BlurText
            as="h1"
            text={title}
            className="display-font text-xl font-bold tracking-tight text-primary sm:text-2xl"
            delay={70}
            animateBy="words"
          />
        ) : null}
        {subtitle ? (
          <BlurFade as="p" className="mt-1 text-sm text-muted" delay={0.08}>
            {subtitle}
          </BlurFade>
        ) : null}
      </div>
      {actions ? (
        <BlurFade className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end" delay={0.12}>
          {actions}
        </BlurFade>
      ) : null}
    </div>
  );
}

export default PageHeader;
