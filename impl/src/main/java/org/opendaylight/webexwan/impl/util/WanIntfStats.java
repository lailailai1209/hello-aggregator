package org.opendaylight.webexwan.impl.util;

import javax.annotation.concurrent.Immutable;

@Immutable
public class WanIntfStats {
    private final Long outPps;
    private final Long outBps;
    // private final Long inPps;
    // private final Long inBps;

    public WanIntfStats(final Long outPps, final Long outBps) {
        this.outPps = outPps;
        this.outBps = outBps;
    }

    public Long getOutPps() {
        return outPps;
    }

    public Long getOutBps() {
        return outBps;
    }

    @Override
    public String toString() {
        return "outPps: " + outPps + " outBps: " + outBps;
    }
}
