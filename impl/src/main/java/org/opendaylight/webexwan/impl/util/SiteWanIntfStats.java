package org.opendaylight.webexwan.impl.util;

import javax.annotation.concurrent.Immutable;

@Immutable
public class SiteWanIntfStats implements Comparable<SiteWanIntfStats> {
    private final WanIntfStats stats;
    private final String site;

    public SiteWanIntfStats(final WanIntfStats stats, final String site) {
        this.stats = stats;
        this.site = site;
    }

    public WanIntfStats getStats() {
        return stats;
    }

    public String getSite() {
        return site;
    }

    @Override
    public int compareTo(SiteWanIntfStats toStats) {
        Long diff = this.stats.getOutBps() - toStats.getStats().getOutBps();
        if(diff > 0)
            return 1;
        else if(diff < 0)
            return -1;
        else
            return 0;
    }

    @Override
    public String toString() {
        return "site: " + site + " stats: " + stats.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SiteWanIntfStats that = (SiteWanIntfStats) o;

        return !(site != null ? !site.equals(that.site) : that.site != null);

    }

    @Override
    public int hashCode() {
        return site != null ? site.hashCode() : 0;
    }
}
